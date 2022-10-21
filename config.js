
const apiPort = '8001';
const staticPort = '3333';
const transport =  'fastify';// http ||  ws || fastify
const logger = 'native';

module.exports = {
    transport: transport,
    apiPort: apiPort,
    staticPort: staticPort,
    logger: logger,
    transports: {
        http: './transports/http.js',
        ws: './transports/ws.js',
        fastify:'./transports/fastify.js'
    } ,
    urls: {
        http: `http://127.0.0.1:${apiPort}/`,
        ws: `ws://127.0.0.1:${apiPort}/ `
    },
    loggers:{
        native: './loggers/logger.js',
        pino: './loggers/pino-adapter.js'
    },
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: '9-logger',
        user: 'postgres',
        password: 'root',
    },
    headers: {
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json; charset=UTF-8',
      }
}