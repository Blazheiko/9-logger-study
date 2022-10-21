'use strict';

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');
const pino = require('pino');


class Logger {
    constructor(logPath) {
        const date = new Date().toISOString().substring(0, 10);
        const filePath = path.join(logPath, `${date}.log`);
        const streams = [
            {stream: fs.createWriteStream(filePath)},
            {stream: process.stdout},
            {level: 'error', stream: process.stderr},
        ];
        const multistream = pino.multistream;
        this.logger = pino({level: 'debug',level: 'info'}, multistream(streams))
    }
  
    close() {
      return new Promise((resolve) => resolve);
    }
  
    // write(type = 'info', s) {
    //   const now = new Date().toISOString();
    //   const date = now.substring(0, DATETIME_LENGTH);
    //   const color = COLORS[type];
    //   const line = date + '\t' + s;
    //   console.log(color + line + '\x1b[0m');
    //   const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
    //   this.stream.write(out);
    // }
  
    log(...args) {
      const msg = util.format(...args);
    //   this.write('info', msg);
        this.logger.info(msg)
    }
  
    dir(...args) {
      const msg = util.inspect(...args);
    //   this.write('info', msg);
        this.logger.info(msg)
    }
  
    debug(...args) {
      const msg = util.format(...args);
    //   this.write('debug', msg);
        this.logger.debug(msg)
    }
  
    error(...args) {
      const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
      this.logger.error(msg)
    //   this.write('error', msg.replace(this.regexp, ''));
    
    }
  
    system(...args) {
    //   const msg = util.format(...args);
    //   this.write('system', msg);
        this.logger.system(...args)
    }
  
    access(...args) {
    //   const msg = util.format(...args);
    //   this.write('access', msg);
        this.logger.access(...args)
    }
  }
  
  module.exports = new Logger('./log');