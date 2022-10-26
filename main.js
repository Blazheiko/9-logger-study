'use strict';


const fsp = require('node:fs').promises;
const path = require('node:path');

const config = require('./config.js');
const transport = config.transports[config.transport]
const build = require('./build.js')
build(config)


const server = require(transport);
const staticServer = require('./static.js');
// const load = require('./load.js');
const dbLib = require('./db.js')(config.db);
const db = Object.freeze(dbLib);


const loggerUrl = config.loggers[config.logger]
const loggerLib = require(loggerUrl);
const logger = Object.freeze(loggerLib);

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
    routing[serviceName] = require(filePath)(db,Object.freeze(logger));
  }
             
  staticServer('./static', config.staticPort,logger);
  server(routing, config.apiPort,logger);
  
})();
