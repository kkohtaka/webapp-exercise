// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var util = require('util');
  var pg = require('pg');

  var connectionString = util.format('postgres://%s:%s@%s:%s/%s',
      process.env.DATABASE_USER,
      process.env.DATABASE_PASS,
      process.env.DATABASE_HOST,
      process.env.DATABASE_PORT,
      process.env.DATABASE_NAME);

  var scheme = {
    id: 'SERIAL PRIMARY KEY',
    text: 'VARCHAR(140) not null',
    created: 'TIMESTAMP',
    updated: 'TIMESTAMP',
  };
  var schemeString = Object.keys(scheme).map(function (key, index) {
    return key + ' ' + scheme[key];
  }).join(', ');

  var client = new pg.Client(connectionString);
  client.connect();
  var sql = util.format('CREATE TABLE IF NOT EXISTS messages(%s)', schemeString);
  var query = client.query(sql);
  console.log('Creating table...');
  query.on('end', function () {
    console.log('Done.');
    client.end();
  });
}());
