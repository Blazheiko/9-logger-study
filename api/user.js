'use strict';

// const db = require('../db.js');
// const user = db('user');
const hash = require('../hash.js');

module.exports = (db,logger) => {
    const user = db('users');

    return ({
      read(id) {
        logger.log(`user read ${id}`)
        return user.read(id, ['id', 'login']);
      },
    
      async create ({ login, password }) {
        const passwordHash = await hash(password);
        return user.create({ login, password: passwordHash });
      },
    
      async update(id, { login, password }) {
        const passwordHash = await hash(password);
        return user.update(id, { login, password: passwordHash });
      },
    
      delete(id) {
        return user.delete(id);
      },
    
      find(mask) {
        const sql = 'SELECT login from users where login like $1';
        return user.query(sql, [mask]);
      }
    })

  }
