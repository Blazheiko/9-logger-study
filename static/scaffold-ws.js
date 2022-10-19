

const scaffold = (structure,apiUrl) => {
  window.socket = new WebSocket(apiUrl);
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) => new Promise((resolve) => {
        const packet = { name: serviceName, method: methodName, args };
        socket.send(JSON.stringify(packet));
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          resolve(data);
        };
      });
    }
  }
  socket.addEventListener('open', async () => {
    const data = await api.user.read(3);
    console.dir({ data });
  })
  return api;
};

export default scaffold