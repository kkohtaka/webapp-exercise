// Copyright 2016, Z Lab Corporation. All rights reserved.

(() => {
  'use strict';

  const makeQuery = require('./database').makeQuery;
  const bluebird = require('bluebird');

  class User {
    static findById(id, done) {
      bluebird.coroutine(function *() {
        try {
          const users = yield makeQuery('SELECT * FROM users WHERE id = $1',
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

    static get(offset, amount, done) {
      bluebird.coroutine(function *() {
        try {
          const users = yield makeQuery(
              'SELECT * FROM users ORDER BY id ASC LIMIT $1 OFFSET $2',
              [amount, offset]);
          return done(null, users);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }
  }

  module.exports = User;
})();
