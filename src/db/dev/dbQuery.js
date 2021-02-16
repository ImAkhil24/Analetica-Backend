// gain insights y this file is needed

const pool = require('./pool');

module.exports = {
  query(queryText, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(queryText, params)
        .then((res) => {
          resolve(res);
          pool.end();
        })
        .catch((err) => {
          reject(err);
          pool.end();
        });
    });
  },
};
