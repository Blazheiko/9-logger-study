
const fsp = require('node:fs').promises;
const path = require('node:path');
const structure = require('./structure.js');

module.exports = async (config) => {
    const srcPath = path.join(process.cwd(), './src')
    const indexPaht = path.join(srcPath, 'front-config.js')
    
    const indexHtml = await fsp.readFile(indexPaht, 'utf-8');
    const fronTransport = (config.transport === 'ws' || config.transport === 'fastify_ws') ? 'ws' : 'http';
    const html = indexHtml
                  .replace('{{transport}}', fronTransport)
                  .replace('{{apiUrl}}', config.urls[fronTransport])
                  .replace('{{structure}}', JSON.stringify(structure))
  
    const staticPath = path.join(process.cwd(), './static')
    const index = path.join(staticPath, 'config.js')
    await fsp.writeFile(index,html) 
}