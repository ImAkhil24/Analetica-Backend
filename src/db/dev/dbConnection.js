const pool = require('./pool');

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('connected to db');
});

const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users 
    (id SERIAL PRIMARY KEY,
    email VARCHAR(30),
    createdAt VARCHAR(30),
    password VARCHAR(64),
    displayName VARCHAR(64));`;

  pool
    .query(userCreateQuery)
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      pool.end();
    });
};

const dropUserTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS users;';
  pool
    .query(usersDropQuery)
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      pool.end();
    });
};

const createAllTables = () => {
  createUserTable();
};

const dropAllTables = () => {
  dropUserTable();
};

pool.on('remove', () => {
  // eslint-disable-next-line no-console
  console.log('client removed');
  process.exit(0);
});

module.exports = { createAllTables, dropAllTables };

require('make-runnable');
