'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const config = require('./config.js');
const structure = require('./structure.js');

module.exports = (root, port) => {
  http.createServer(async (req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    if(req.url !== '/'){
      res.setHeader('Content-type', 'text/javascript')  
    }
    const filePath = path.join(root, url);
    try {
      // let html = await fs.promises.readFile(filePath);
      const template = fs.readFileSync(filePath, 'utf-8');
      const transport = config.transport === 'ws'? 'ws': 'http' ;
      const html = template
                    .replace('{{transport}}', transport)
                    .replace('{{apiUrl}}', config.urls[transport])
                    .replace('{{structure}}', JSON.stringify(structure))

      res.end(html);
    } catch (err) {
      res.statusCode = 404;
      res.end('"File is not found"');
    }
  }).listen(port);

  console.log(`Static on port ${port}`);
};
