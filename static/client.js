'use strict';

const creatorApi = (structure,apiUrl,transport) =>{
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

const wsTransport = (serviceName,methodName,apiUrl) => (...args) => new Promise((resolve) => {
  const packet = { name: serviceName, method: methodName, args };
  socket.send(JSON.stringify(packet));
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    resolve(data);
  };
});

transports.ws = (structure,apiUrl) => {
  window.socket = new WebSocket(apiUrl);
  const api = creatorApi(structure,apiUrl,wsTransport)

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
  const api = creatorApi(structure,apiUrl,httpTransport)

  return Promise.resolve(api);
};

const init = async () => {
  window.api = await transports[window.transport](JSON.parse(window.structure),window.apiUrl);
  const data = await window.api.user.read(1);
  console.dir({ data });
}

init()







