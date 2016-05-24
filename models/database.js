// Copyright 2016, Z Lab Corporation. All rights reserved.

(() => {
  'use strict';

  const util = require('util');
  const pg = require('pg');
  const bluebird = require('bluebird');

  const connectionString = util.format('postgres://%s:%s@%s:%s/%s',
      process.env.DATABASE_USER,
      process.env.DATABASE_PASS,
      process.env.DATABASE_HOST,
      process.env.DATABASE_PORT,
      process.env.DATABASE_NAME);

  const makeQuery = (sql, args) => {
    return new Promise((resolve, reject) => {
      const client = new pg.Client(connectionString);
      client.connect();
      const query = client.query(sql, args);
      let users = [];
      query.on('row', function (row) {
        users.push(row);
      });
      query.on('error', function (err) {
        reject(err);
      });
      query.on('end', function (data) {
        resolve(users);
      });
    });
  };

  const schemes = {
    users: {
      id: 'VARCHAR(30) PRIMARY KEY',
      name: 'VARCHAR(256)',
      email: 'VARCHAR(256)',
    },
    messages: {
      mid: 'SERIAL PRIMARY KEY',
      uid: 'VARCHAR(30) REFERENCES users(id) NOT NULL',
      text: 'VARCHAR(140) NOT NULL',
      created: 'TIMESTAMP',
      updated: 'TIMESTAMP',
    },
  };

  const tableCreater = (name) => {
    const scheme = schemes[name];
    return (done) => {
      const schemeString = Object.keys(scheme).map((key, index) => {
        return key + ' ' + scheme[key];
      }).join(', ');

      const client = new pg.Client(connectionString);
      client.connect();

      console.log(name, ': Creating table...');
      const query = client.query(util.format(
        'CREATE TABLE IF NOT EXISTS %s(%s)',
        name, schemeString));
      query.on('error', (err) => {
        console.error(name, ': Failed to create.', err);
        client.end();
        if (done) done(err);
      });
      query.on('end', () => {
        console.log(name, ': Created.');
        client.end();
        if (done) done(null);
      });
    };
  };

  const tableDeleter = (name) => {
    return (done) => {
      const client = new pg.Client(connectionString);
      client.connect();

      console.log(name, ': Dropping table...');
      const query = client.query(util.format('DROP TABLE IF EXISTS %s',
        name));
      query.on('error', (err) => {
        console.error(name, ': Failed to drop.', err);
        client.end();
        if (done) done(err);
      });
      query.on('end', () => {
        console.log(name, ': Dropped.');
        client.end();
        if (done) done();
      });
    };
  };

  const tableReseter = (name) => {
    return (done) => {
      console.log(name, ': Resetting table...');
      tableDeleter(name)((err) => {
        if (err) {
          console.log(name, ': Failed to reset.');
          if (done) done(err);
        } else {
          tableCreater(name)((err) => {
            if (err) {
              console.log(name, ': Failed to reset.');
            } else {
              console.log(name, ': Reset.');
            }
            if (done) done(err);
          });
        }
      });
    };
  };

  const createMessagesTable = (done) => {
    tableCreater('messages')(done);
  };

  const createUsersTable = (done) => {
    tableCreater('users')(done);
  };

  const deleteMessagesTable = (done) => {
    tableDeleter('messages')(done);
  };

  const deleteUsersTable = (done) => {
    tableDeleter('users')(done);
  };

  const createTables = (done) => {
    createUsersTable(() => {
      createMessagesTable(done);
    });
  };

  const deleteTables = (done) => {
    deleteMessagesTable(() => {
      deleteUsersTable(done);
    });
  };

  const resetTables = (done) => {
    deleteTables(() => {
      createTables(done);
    })
  };

  const insertTestData = (done) => {
    bluebird.coroutine(function *() {
      console.log('Generating test data...');
      const client = new pg.Client(connectionString);
      client.connect();

      const insertUsers = (id, name, email) => {
        return new Promise((resolve, reject) => {
          const query = client.query(
              'INSERT INTO users (id, name, email) VALUES ($1, $2, $3)',
              [id, name, email]);
          query.on('error', (err) => {
            reject(err);
          });
          query.on('end', (data) => {
            resolve(data);
          });
        });
      };
      const insertMessages = (uid, text) => {
        return new Promise(function (resolve, reject) {
          const query = client.query(
              'INSERT INTO messages (uid, text, created, updated) VALUES ($1, $2, $3, $4)',
              [uid, text, 'NOW()', 'NOW()']);
          query.on('error', (err) => {
            reject(err);
          });
          query.on('end', (data) => {
            resolve(data);
          });
        });
      };
      const numTestUsers = 5;
      const numTestMessages = 100;
      for (let i = 0; i < numTestUsers; i++) {
        yield insertUsers(
            String(i % numTestUsers),
            'user' + i,
            'user' + i + '@gmail.com');
      }
      for (let i = 0; i < numTestMessages; i++) {
        yield insertMessages(
            String(i % numTestUsers),
            'Test Message: ' + i);
      }
      console.log('Generated.');
      done();
    })();
  };

  module.exports = {};
  module.exports.makeQuery = makeQuery;
  module.exports.createTables = createTables;
  module.exports.deleteTables = deleteTables;
  module.exports.resetTables = resetTables;
  module.exports.insertTestData = insertTestData;
})();
