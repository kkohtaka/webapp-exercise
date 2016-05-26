// Copyright 2016, Z Lab Corporation. All rights reserved.

(() => {
  'use strict';

  const util = require('util');
  const pg = require('pg');
  const bluebird = require('bluebird');

  const connectionString = util.format('postgres://%s:%s@%s:%s/%s',
      process.env.DATABASE_USER,
      process.env.DATABASE_PASS,
      process.env.POSTGRES_MASTER_SERVICE_HOST,
      process.env.POSTGRES_MASTER_SERVICE_PORT,
      process.env.DATABASE_NAME);

  const makeQuery = (sql, args) => {
    return new Promise((resolve, reject) => {
      const client = new pg.Client(connectionString);
      client.connect();
      const query = client.query(sql, args);
      let users = [];
      query.on('row', (row) => {
        users.push(row);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
      query.on('end', (data) => {
        client.end();
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
    const schemeString = Object.keys(scheme).map((key, index) => {
      return key + ' ' + scheme[key];
    }).join(', ');
    const sql = util.format('CREATE TABLE IF NOT EXISTS %s(%s)', name, schemeString);
    return (done) => {
      bluebird.coroutine(function *() {
        try {
          console.log(name, ': Creating table...');
          yield makeQuery(sql, []);
          console.log(name, ': Created.');
          if (done) done(null);
        } catch (err) {
          console.error(name, ': Failed to create.', err);
          if (done) done(err);
        }
      })();
    };
  };

  const tableDeleter = (name) => {
    const scheme = schemes[name];
    const sql = util.format('DROP TABLE IF EXISTS %s', name);
    return (done) => {
      bluebird.coroutine(function *() {
        try {
          console.log(name, ': Dropping table...');
          yield makeQuery(sql, []);
          console.log(name, ': Dropped.');
          if (done) done(null);
        } catch (err) {
          console.error(name, ': Failed to drop.', err);
          if (done) done(err);
        }
      })();
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
      const numTestUsers = 5;
      const numTestMessages = 100;
      for (let i = 0; i < numTestUsers; i++) {
        yield makeQuery(
            'INSERT INTO users (id, name, email) VALUES ($1, $2, $3)',
            [
              String(i % numTestUsers),
              'user' + i,
              'user' + i + '@gmail.com',
            ])
      }
      for (let i = 0; i < numTestMessages; i++) {
        yield makeQuery(
          'INSERT INTO messages (uid, text, created, updated) VALUES ($1, $2, $3, $4)',
          [
            String(i % numTestUsers),
            'Test Message: ' + i,
            'NOW()',
            'NOW()',
          ]);
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
