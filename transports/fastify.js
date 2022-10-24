const fastify = require('fastify')({ logger: false});
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




module.exports = (routing, port,logger) => {

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
            logger.log( request.body )

            try{
              const result = await handler(...request.body);
              return JSON.stringify(result.rows)
        
            }catch(err){
              logger.eror(err)
              reply.statusCode = 500
              return 'Server error'
            }
            
           
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
