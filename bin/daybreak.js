const fs = require('fs');
const readline = require('readline');
const { pipeline } = require('stream');
const { createGunzip } = require('zlib');
const { promisify } = require('util');

const dataDir = './forbidden_knowledge' ;
const tempDir = `${dataDir}/.temp`;
const outDir = `${dataDir}/digested`;

function cleanup() {
  fs.rmdirSync(tempDir, {recursive: true}, (err) => null);
  fs.rmdirSync(outDir, {recursive: true}, (err) => null);
}

function setup() {
  cleanup();
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
           (err) => err ? console.log(`problem with file ${file}: ${err}`) : null);


  for await (const line of rl) {
    const turn = JSON.parse(line);
    const season = turn.sim.season.toString();
    const day = turn.sim.day.toString();
    const outStream = ensureOutstream(outStreams, season, day, timestamp.toString());
    outStream.write(line);
    outStream.write("\n");
  }

  endOutStreams(outStreams);
  process.stdout.write('\u254D');
}

function tempToDays() {
  fs.readdirSync(tempDir).forEach((season) =>
    fs.readdirSync(`${tempDir}/${season}`).forEach(async (day) => {
      const dir = `${tempDir}/${season}/${day}`;
      const seasonDir = `${outDir}/${season}`;
      if (!fs.existsSync(seasonDir)) {
        fs.mkdirSync(seasonDir);
      }

      Promise.all(fs.readdirSync(dir)
                    .map(file => [parseInt(file), `${dir}/${file}`])
                    .sort()
                    .map(([timestamp, fileName]) => promisify(fs.readFile)(fileName, (err, data) => err ? '' : data))
      )
             .then((filesData) =>
               fs.writeFile(`${seasonDir}/${day}.txt`,
                            filesData.join("\n"),
                            (err) => err ? console.log(err) : null)
             );
    })
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
           tempToDays();
         });
}

rewriteForbiddenKnowledge();
