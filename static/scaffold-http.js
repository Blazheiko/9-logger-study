
  //  const httpMethods = {
  //   read: 'GET',
  //   create: 'POST',
  //   update: 'PUT',
  //   delete: 'DELETE',
  //   find: 'GET'
  // }

  const scaffold = async (structure,apiUrl) => {
 
    window.api = {};
    const services = Object.keys(structure);
    for (const serviceName of services) {
      api[serviceName] = {};
      const service = structure[serviceName];
      const methods = Object.keys(service);
      for (const methodName of methods) {
        api[serviceName][methodName] = (...args) => new Promise((resolve,reject) => {
          const url = `${apiUrl}${serviceName}/${methodName}`
          console.log(url, args);
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( args ),
          }).then((res) => {
            console.log(res)
            // if (res.status === 200) resolve(res.json());
            // else reject(new Error(`Status Code: ${res.status}`));
            const { status } = res;
            if (status !== 200) {
              reject(new Error(`Status Code: ${status}`));
              return;
            }
            return resolve(res.json());
          });
        });
      }
    }
    //mode: 'no-cors'
    const data = await api.user.read(3);
    console.dir({ data });
    return api;
  };
  
  export default scaffold