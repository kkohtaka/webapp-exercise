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

  var createMessagesTable = function (done) {
    var scheme = {
      id: 'SERIAL PRIMARY KEY',
      text: 'VARCHAR(140) NOT NULL',
      created: 'TIMESTAMP',
      updated: 'TIMESTAMP',
    };
    var schemeString = Object.keys(scheme).map(function (key, index) {
      return key + ' ' + scheme[key];
    }).join(', ');

    var client = new pg.Client(connectionString);
    client.connect();
    var sql = util.format('CREATE TABLE IF NOT EXISTS messages(%s)', schemeString);

    console.log('Creating table...');
    var query = client.query(sql);

    query.on('error', function (err) {
      console.error('Failed to create.', err);
      client.end();
      if (done) done(err);
    });

    query.on('end', function () {
      console.log('Created.');
      client.end();
      if (done) done(null);
    });
  };

  var deleteMessagesTable = function (done) {
    var client = new pg.Client(connectionString);
    client.connect();
    var sql = util.format('DROP TABLE IF EXISTS messages');

    console.log('Dropping table...');
    var query = client.query(sql);

    query.on('error', function (err) {
      console.error('Failed to drop.', err);
      client.end();
      if (done) done(err);
    });

    query.on('end', function () {
      console.log('Dropped.');
      client.end();
      if (done) done();
    });
  };

  var resetMessagesTable = function (done) {
    console.log('Resetting table...');
    deleteMessagesTable(function (err) {
      if (err) {
        console.log('Failed to reset.');
        if (done) done(err);
      } else {
        createMessagesTable(function (err) {
          if (err) {
            console.log('Failed to reset.');
          } else {
            console.log('Reset.');
          }

          if (done) done(err);
        });
      }
    });
  };

  const insertTestDAta = function (done) {
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
  module.exports.createMessagesTable = createMessagesTable;
  module.exports.deleteMessagesTable = deleteMessagesTable;
  module.exports.resetMessagesTable = resetMessagesTable;
  module.exports.insertTestDAta = insertTestDAta;
}());
