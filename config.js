
const apiPort = '8001';
const staticPort = '3333';

module.exports = {
    transport: 'http',// http ||  ws
    transports: {
        http: './transports/http.js',
        ws: './transports/ws.js'
    } ,
    urls: {
        http: `http://127.0.0.1:${apiPort}/`,
        ws: `ws://127.0.0.1:${apiPort}/ `
    },
    apiPort: apiPort,
    staticPort: staticPort,
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: '9-logger',
        user: 'postgres',
        password: 'root',
    }
}