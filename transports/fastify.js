const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');


const structure = require('../structure.js')
const config =require('../config.js');
(async ()=>{
  await fastify.register(cors, { 
    origin:config.headers['Access-Control-Allow-Origin'],
    methods:config.headers['Access-Control-Allow-Methods'],
    allowedHeaders:config.headers['Access-Control-Allow-Headers']
  });
})()




module.exports = (routing, port) => {

const services = Object.keys(structure);
for (const serviceName of services) {
    const service = structure[serviceName];
    const methods = Object.keys(service);
    const entity = routing[serviceName];
    for (const methodName of methods) {
        const url = `/${serviceName}/${methodName}`
        const handler = entity[methodName];
      
        fastify.post(url, async (request, reply) => {
            reply.header('Content-Type',config.headers['Content-Type'])
            console.log( request.body )
            
            const result = await handler(...request.body);
            return JSON.stringify(result.rows)
          })
    }
}
  
  const start = async () => {
    try {
      await fastify.listen({ port: port })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()
};
