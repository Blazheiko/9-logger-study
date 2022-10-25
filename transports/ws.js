'use strict';

// const console = require('../logger.js');
const { Server } = require('ws');

module.exports = (routing, port,logger) => {
  const ws = new Server({ port });

  ws.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress;
    connection.on('message', async (message) => {
      const obj = JSON.parse(message);
      const {index, name, method, args = [] } = obj;
      
      const entity = routing[name];
      if (!entity) return connection.send('"Not found"', { binary: false });
      const handler = entity[method];
      if (!handler) return connection.send('"Not found"', { binary: false });
      const json = JSON.stringify(args);
      const parameters = json.substring(1, json.length - 1);
      logger.log(`${ip} ${name}.${method}(${parameters})`);
      try {
        const result = await handler(...args);
        const data = { index, result:result.rows }
        connection.send(JSON.stringify(data), { binary: false });
      } catch (err) {
        logger.error(err);
        connection.send('"Server error"', { binary: false });
      }
    });
  });

  console.log(`API on port ${port}`);
};
