'use strict';


const fsp = require('node:fs').promises;
const path = require('node:path');
const build = require('./build.js')
const config = require('./config.js');
const transport = config.transports[config.transport]
const loggerUrl = config.loggers[config.logger]
const server = require(transport);
const staticServer = require('./static.js');
// const load = require('./load.js');
const dbLib = require('./db.js')(config.db);
const loggerLib = require(loggerUrl);

const db = Object.freeze(dbLib);
const logger = Object.freeze(loggerLib);

build(config)

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
    routing[serviceName] = require(filePath)(db,logger);
  }
             
  staticServer('./static', config.staticPort,logger);
  server(routing, config.apiPort,logger);
  
})();
