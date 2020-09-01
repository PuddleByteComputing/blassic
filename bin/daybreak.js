import fs from 'fs';
import readline from 'readline';
import { pipeline } from 'stream';
import { createGunzip } from 'zlib';
import { promisify } from 'util';
import { lastLine, lineCount } from './lineCount.js';

const dataDir = './forbidden_knowledge' ;
const tempDir = `${dataDir}/.temp`;
const outDir = `${dataDir}/digested`;

// TODO: make this incremental (only process new data)

function cleanup() {
  fs.rmdirSync(tempDir, {recursive: true}, (err) => null);
}

function setup() {
  cleanup();
  fs.rmdirSync(outDir, {recursive: true}, (err) => null);
  fs.mkdirSync(tempDir);
  fs.mkdirSync(outDir, {recursive: true});
}

function forbiddenList() {
  const files = [];
  const entries = fs.readdirSync(dataDir, {withFileTypes: true});
  entries.forEach((file) => {
    if (file.isFile()) {
      const match = file.name.match(/blaseball-log-(\d+).json.gz$/);
      if(match) {
        files.push([file.name, parseInt(match[1])]);
      }
    }
  });

  return files.map(([s, t]) => [t, s]).sort().map(([t, s]) => [s, t]);
}

function ensureOutstream(outStreams, season, day, timestamp) {
  if(!outStreams[season]?.[day]) {
    if(!outStreams[season]) {
      outStreams[season] = {};
    }
    const streamDir =`${tempDir}/${season}/${day}`;
    fs.mkdirSync(streamDir, {recursive: true});
    outStreams[season][day] = fs.createWriteStream(`${streamDir}/${timestamp}`);
  }

  return outStreams[season][day];
}

function endOutStreams(outStreams) {
  for (const season in outStreams) {
    for (const day in outStreams[season]) {
      outStreams[season][day].end();
    }
  }
}

async function forbiddenToTemp([file, timestamp]) {
  const path = `${dataDir}/${file}`;
  const fileStream = fs.createReadStream(path);
  const unzip = createGunzip();
  const rl = readline.createInterface(unzip);
  const outStreams = {};

  pipeline(fileStream, unzip,
           (err) => err ? console.error(`problem with file ${file}: ${err}`) : null);

  let lineCount = 0;

  for await (const line of rl) {
    // NOTE - parsing every line of these files is expensive,
    //   the tradeoff is cleaner data in the digested gameday files.
    const turn = JSON.parse(line);
    if(!turn.sim?.season) {
      const keys = Object.keys(turn);
      if (keys.length !== 1 || keys[0] !== 'clientMeta') {
        console.error(`file: ${path}, line ${lineCount} keys: ${keys}`);
      } else {
        // there are records like this in the archives-- clientMeta but no data. We just skip them.
      }
    } else {
      const season = turn.sim.season.toString();
      const day = turn.sim.day.toString();
      const outStream = ensureOutstream(outStreams, season, day, timestamp.toString());
      outStream.write(line);
      outStream.write("\n");
    }
    lineCount++;
  }

  endOutStreams(outStreams);
  process.stdout.write('\u254D');
}

function postseasonMetadata(gameTurn) {
  if (!gameTurn.postseason.playoffs) {
    return ({});
  }

  return ({
    postseason: {
      game: gameTurn.postseason.round.gameIndex,
      name: gameTurn.postseason.round.name,
      round: gameTurn.postseason.round.roundNumber,
    }
  });
}

async function tempsToDays() {
  return Promise.all(
    fs.readdirSync(tempDir)
      .flatMap((season) =>
        fs.readdirSync(`${tempDir}/${season}`).map(async (day) => {
          const dir = `${tempDir}/${season}/${day}`;
          const seasonDir = `${outDir}/${season}`;
          if (!fs.existsSync(seasonDir)) {
            fs.mkdirSync(seasonDir);
          }

          return (
            Promise.all(fs.readdirSync(dir)
                          .map(file => [parseInt(file), `${dir}/${file}`])
                          .sort()
                          .map(([timestamp, fileName]) =>
                            promisify(fs.readFile)(fileName, (err, data) => err ? '' : data))
            )
                   .then((filesData) => {
                     const catted = Buffer.concat(filesData);
                     const lastTurn = JSON.parse(lastLine(catted));
                     if(!lastTurn.schedule[0].gameStart) { return false; }

                     fs.writeFile(`${seasonDir}/${day}.txt`,
                                  catted,
                                  (err) => err ? console.error(err) : null);
                     return ([season, day, { turns: lineCount(catted),
                                             complete: lastTurn.schedule.every((g) => g.gameComplete),
                                             ...postseasonMetadata(lastTurn)}]);
                   })
          );
        })
      )
    );
}

function rewriteForbiddenKnowledge() {
  setup();

  const forbiddenFiles = forbiddenList();

  console.log(`Breaking days for ${forbiddenFiles.length} forbidden files`);
  console.log(`${Array(forbiddenFiles.length + 1).join('\u2500')}\u2510`);
  Promise.all(forbiddenFiles.map(forbiddenToTemp))
         .then(() => {
           console.log('\u2519');
           console.log('Days broken, recombining...');
           tempsToDays()
             .then((linecounts) =>
               fs.writeFile(`${outDir}/index.json`,
                            JSON.stringify(
                              linecounts.reduce((memo, data) => {
                                if(!data) { return memo; }
                                const [s, d, metadata] = data;
                                return ({...memo, [s]: {...memo?.[s], [d]: metadata}});
                              }, {})
                            ),
                            (err) => err ? console.log(err) : null)
               )
             .then(cleanup);
         });
}

rewriteForbiddenKnowledge();
