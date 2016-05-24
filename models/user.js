// Copyright 2016, Z Lab Corporation. All rights reserved.

(() => {
  'use strict';

  const connectionString = require('./database').connectionString;
  const pg = require('pg');
  const util = require('util');
  const bluebird = require('bluebird');

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

  class User {
    static findById(id, done) {
      bluebird.coroutine(function *() {
        try {
          let users = yield makeQuery('SELECT * FROM users WHERE id = $1',
              [id]);
          if (users.length > 0) {
            return done(null, users[0]);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }

    static findOrCreate(profile, done) {
      bluebird.coroutine(function *() {
        try {
          let users = yield makeQuery('SELECT * FROM users WHERE id = $1',
              [profile.id]);
          if (users.length > 0) {
            return done(null, users[0]);
          }
          users = yield makeQuery('INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *',
              [profile.id, profile.name, profile.email]);
          return done(null, users[0] || null);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }
  }

  module.exports = User;
})();
