// Fuck this file wasted my so much time now i have done the same directly using docker

const pool = require('./pool');

const dbQuery = require('./dbQuery');

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('connected to db');
});

const createUserTable = async () => {
  // console.log('1');
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users 
    (userId SERIAL PRIMARY KEY,
    email VARCHAR(30),
    createdAt VARCHAR(30),
    password VARCHAR(64),
    displayName VARCHAR(64));`;
  const promise = await dbQuery.query(userCreateQuery);
  console.log('i m here');
  console.log(promise);
  promise.then(() => {
    console.log('promise fullfilled');
  });
};

const createWebsiteTable = async () => {
  // console.log('2');
  const websiteCreateQuery = `CREATE TABLE IF NOT EXISTS website   
  (websiteId SERIAL PRIMARY KEY,
  websiteName VARCHAR(30),
  baseUrl VARCHAR(30),
  userId SERIAL references users(userId)); `;
};
// pages (significance is tht every route must not necessarly be in hits)

const createPagesTable = async () => {
  const pagesCreateQuery = `CREATE TABLE IF NOT EXISTS pages   
  (websiteId SERIAL references website(websiteID),
  route VARCHAR(30),    
  baseUrl VARCHAR(30),
  pageHits INT);`; // insert a check before inserting any routes

  await pool
    .query(pagesCreateQuery)
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log(res);
      pool.end();
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      pool.end();
    });
  // console.log('3');
};

const createHitsTable = async () => {
  const hitsCreateQuery = `CREATE TABLE IF NOT EXISTS hits 
  (websiteId SERIAL references website(websiteID),
  visitors INTEGER,
  uniqueVisitors INTEGER,
  timeStamp VARCHAR(64),
  route VARCHAR(64));`;

  await pool
    .query(hitsCreateQuery)
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
  // console.log('4');
};

const createSessionTable = async () => {
  const sessionCreateQuery = `CREATE TABLE IF NOT EXISTS session 
  (sessionId VARCHAR(64),
  websiteId SERIAL references website(websiteID),
  sessionSt VARCHAR(64),
  sessionEn VARCHAR(64),
  enRoute VARCHAR(64) ,
  exRoute VARCHAR(64) ,
  ipAddress VARCHAR(64),
  country VARCHAR(64),
  browser VARCHAR(64),
  device VARCHAR(64));`;
  // **************make a check for routes***************
  // await pool
  //   .query(sessionCreateQuery)
  //   .then((res) => {
  //     // eslint-disable-next-line no-console
  //     console.log(res);
  //     pool.end();
  //   })
  //   .catch((err) => {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //     pool.end();
  //   });
  // // console.log('5');

  createUserTable();
  createWebsiteTable();
  createPagesTable();
  createHitsTable();
  createSessionTable();
};

const dropUserTable = async () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS users;';
  await pool
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

const dropWebsiteTable = async () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS website;';
  await pool
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

const dropPagesTable = async () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS pages;';
  await pool
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

const dropHitsTable = async () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS hits;';
  await pool
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

const dropSessionTable = async () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS session;';
  await pool
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
  /********** Interesting as some tables depend on each other so we have to make sure a certain table is created before creating another table as by default they run asynchronously ***********/

  // createUserTable().then(createWebsiteTable).then(createPagesTable).then(createHitsTable).then(createSessionTable);
  createUserTable().then(() => {
    console.log('resolved');
  });
};

const dropAllTables = () => {
  dropPagesTable().then(dropHitsTable).then(dropSessionTable).then(dropWebsiteTable).then(dropUserTable);
};

pool.on('remove', () => {
  // eslint-disable-next-line no-console
  console.log('client removed');
  process.exit(0);
});

module.exports = { createAllTables, dropAllTables };

require('make-runnable');
