'use strict';
// const db = require('../db.js');
// const country = db('country');

module.exports = (db) => {

  const country = db('country');

 return ({
    read(id) {
      console.log({ db });
      return country.read(id);
    },
  
    find(mask) {
      const sql = 'SELECT * from country where name like $1';
      return country.query(sql, [mask]);
    }
  })
}


