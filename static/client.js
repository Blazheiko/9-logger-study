'use strict';
 
// import scaffold from `./scaffold-${window.transport}.js`
const scaff = await import(`./scaffold-${window.transport}.js`);
const scaffold = scaff.default;
// import scaffold from './scaffold-ws.js'

const structure = {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
}


const api = scaffold(structure,window.apiUrl);


