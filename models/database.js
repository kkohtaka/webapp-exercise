// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var util = require('util');
  var pg = require('pg');
  const bluebird = require('bluebird');

  var connectionString = util.format('postgres://%s:%s@%s:%s/%s',
      process.env.DATABASE_USER,
      process.env.DATABASE_PASS,
      process.env.DATABASE_HOST,
      process.env.DATABASE_PORT,
      process.env.DATABASE_NAME);

  const schemes = {
    messages: {
      mid: 'SERIAL PRIMARY KEY',
      text: 'VARCHAR(140) NOT NULL',
      created: 'TIMESTAMP',
      updated: 'TIMESTAMP',
    },
    users: {
      gid: 'VARCHAR(30) PRIMARY KEY',
      name: 'VARCHAR(256)',
      email: 'VARCHAR(256)',
    },
  };

  const tableCreater = (name) => {
    const scheme = schemes[name];
    return (done) => {
      var schemeString = Object.keys(scheme).map(function (key, index) {
        return key + ' ' + scheme[key];
      }).join(', ');

      var client = new pg.Client(connectionString);
      client.connect();

      console.log(name, ': Creating table...');
      var query = client.query(util.format(
        'CREATE TABLE IF NOT EXISTS %s(%s)',
        name, schemeString));

      query.on('error', function (err) {
        console.error(name, ': Failed to create.', err);
        client.end();
        if (done) done(err);
      });

      query.on('end', function () {
        console.log(name, ': Created.');
        client.end();
        if (done) done(null);
      });
    };
  };

  const tableDeleter = (name) => {
    return (done) => {
      var client = new pg.Client(connectionString);
      client.connect();

      console.log(name, ': Dropping table...');
      var query = client.query(util.format('DROP TABLE IF EXISTS %s',
        name));

      query.on('error', function (err) {
        console.error(name, ': Failed to drop.', err);
        client.end();
        if (done) done(err);
      });

      query.on('end', function () {
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

      const insert = function (text) {
        return new Promise(function (resolve, reject) {
          const query = client.query('INSERT INTO messages (text, created, updated) VALUES ($1, $2, $3)',
              [text, 'NOW()', 'NOW()']);
          query.on('error', function (err) {
            reject(err);
          });
          query.on('end', function (data) {
            resolve(data);
          });
        });
      };
      for (let i = 0; i < 100; i++) {
        yield insert('Test Message: ' + i);
      }
      console.log('Generated.');
      done();
    })();
  };

  module.exports = {};
  module.exports.createTables = createTables;
  module.exports.deleteTables = deleteTables;
  module.exports.resetTables = resetTables;
  module.exports.insertTestData = insertTestData;
}());
