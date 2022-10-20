'use strict';


const fsp = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');
const transport = config.transports[config.transport]

// const server = require('./ws.js');

const server = require(transport);
const staticServer = require('./static.js');
// const load = require('./load.js');
const db = require('./db.js')(config.db);
const hash = require('./hash.js');
const logger = require('./logger.js');


// const sandbox = {
//   console: Object.freeze(logger),
//   db: Object.freeze(db),
//   common: { hash },
// };
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    // console.log(`./api/${fileName}`)
    // routing[serviceName] = require(`./api/${fileName}`)(db);
    routing[serviceName] = require(filePath)(db);
  }
  console.log(routing)

  staticServer('./static', config.staticPort);
  server(routing, config.apiPort);
})();
