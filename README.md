## Blassic

Replay Classic [Blaseball](https://blaseball.com/) games.

See it live [here](http://puddlebyte.net/blassic).

## Dev / Running a local instance

Prerequisites: [node.js](https://nodejs.org/en/download/package-manager/) (>= v13), the [aws cli](https://aws.amazon.com/cli/), [yarn](https://yarnpkg.com/getting-started/install) (modern npm will probably work, too?)

You will need to run `yarn forbidden && yarn daybreak` to fetch and process the historical blaseball game recordings (Credit to [iliana](https://github.com/iliana/blaseball-archive-scripts) for archiving blaseball games, thank you).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3030/blassic](http://localhost:3030/blassic) to view it in the browser.

The page will reload if you make edits.<br />

### `yarn test`

Launches the test runner in the interactive watch mode.<br />

### `yarn build`

Builds the app for production to the `build` folder.<br />

### `yarn forbidden`

Download the forbidden knowledge

### `yarn daybreak`

Break the forbidden knowledge up into files containing one blaseball-day of data each.

This is incremental.

Only archive files created since last run (via `yarn forbidden`) will be split into fragments.  Fragments go into `forbidden_knowledge/.temp`

All fragments (including old ones) will be recombined into gameday files under `forbidden_knowledge/digested`, and the index.json will be rebuilt.
