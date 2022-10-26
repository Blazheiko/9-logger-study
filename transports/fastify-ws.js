'use strict';

// const console = require('../logger.js');
const fastifyLib = require('fastify');
const fastifyWs = require('@fastify/websocket');


module.exports = (routing, port,logger) => {
    const fastify = fastifyLib();
    fastify.register(fastifyWs)
    fastify.register(async (fastify) => {
      fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
        const ip = req.socket.remoteAddress;
        connection.socket.on('message', async (message) => {

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
              connection.socket.send(JSON.stringify(data), { binary: false });
            } catch (err) {
              logger.error(err);
              connection.socket.send('"Server error"', { binary: false });
            }
          // message.toString() === 'hi from client'
          
        })
      })
    })
    
    fastify.listen({ port }, err => {
      if (err) {
        logger.error(err)
        process.exit(1)
      }
    })

//   ws.on('connection', (connection, req) => {
//     const ip = req.socket.remoteAddress;
//     connection.on('message', async (message) => {
//     //   const obj = JSON.parse(message);
//     //   const {index, name, method, args = [] } = obj;
      
//       const entity = routing[name];
//       if (!entity) return connection.send('"Not found"', { binary: false });
//       const handler = entity[method];
//       if (!handler) return connection.send('"Not found"', { binary: false });
//       const json = JSON.stringify(args);
//       const parameters = json.substring(1, json.length - 1);
//       logger.log(`${ip} ${name}.${method}(${parameters})`);
//       try {
//         const result = await handler(...args);
//         const data = { index, result:result.rows }
//         connection.send(JSON.stringify(data), { binary: false });
//       } catch (err) {
//         logger.error(err);
//         connection.send('"Server error"', { binary: false });
//       }
//     });
//   });

  console.log(`API on port ${port}`);
};