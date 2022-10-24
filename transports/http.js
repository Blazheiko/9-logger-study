'use strict';

const http = require('node:http');
const config =require('../config.js');

// const HEADERS = {
//   'X-XSS-Protection': '1; mode=block',
//   'X-Content-Type-Options': 'nosniff',
//   'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type',
//   'Content-Type': 'application/json; charset=UTF-8',
// };

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

module.exports = (routing, port,logger) => {
  http.createServer(async (req, res) => {

    res.writeHead(200, config.headers);
    if (req.method !== 'POST') return res.end('"Not found"');
    
    const { url, socket } = req;
    
    const [name, method] = url.substring(1).split('/');
    if (!name || !method) return res.end('!name || !method');
    const entity = routing[name];
    if (!entity) return res.end('Not found');
    const handler = entity[method];
    if (!handler) return res.end('Not found');
    const args = await receiveArgs(req);
    logger.log(`${socket.remoteAddress} ${method} ${url}`);
    try{
      const result = await handler(...args);
      res.end(JSON.stringify(result));

    }catch(err){
      logger.eror(err)
      res.statusCode(500);
      res.end('Server error');
    }
    
    
    
  
  }).listen(port);

  console.log(`API on port ${port}`);
};
