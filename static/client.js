'use strict';

import config from './config.js';
// console.log(config)
const structure = JSON.parse(config.structure);


const scaffold = (structure,apiUrl,transport) =>{
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = transport(serviceName,methodName,apiUrl);
    }
  }

  return api;
}

const transports = {};

const storageResolves = {}
let testIndex = 0;

const wsTransport = (serviceName,methodName,apiUrl) => (...args) => new Promise((resolve) => {  
    const index = testIndex++; 
    const packet = { name: serviceName, method: methodName, index, args };
    storageResolves[index] = resolve
    socket.send(JSON.stringify(packet));
  });
  

transports.ws = (structure,apiUrl) => {
  window.socket = new WebSocket(apiUrl);

  socket.onmessage = (event) => { 
    console.log(event)
    const data = JSON.parse(event.data);  
    const resolve = storageResolves[data.index]
    if(resolve)resolve(data.result)
    else console.error('resolve not found')
    delete storageResolves[data.index]
    // resolve(data.result);
  };
  
  const api = scaffold(structure,apiUrl,wsTransport)

  return new Promise((resolve) => {
    socket.addEventListener('open', () => resolve(api));
  });
};

const httpTransport = (serviceName,methodName,apiUrl) => (...args) =>  new Promise((resolve,reject) => {
  const url = `${apiUrl}${serviceName}/${methodName}`
  // console.log(url, args);
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( args ),
  }).then((res) => {
    const { status } = res;
    // console.log(res)
    if (status !== 200) {
      reject(new Error(`Status Code: ${status}`));
      return;
    }
    return resolve(res.json());
  });
});

transports.http =  (structure,apiUrl) => {
  const api = scaffold(structure,apiUrl,httpTransport)

  return Promise.resolve(api);
};

const init = async () => {
  window.api = await transports[config.transport](structure,config.apiUrl);
  test()
  // const data = await window.api.user.read(1);

  // console.dir({ data });
}
const test = ()=> {
  for(let i = 1; i < 5; i++){
    setTimeout(async () => {
      const data = await api.user.read(i);
      console.dir({ data });
    },5)
  }
}

init()







