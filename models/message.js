// Copyright 2016, Z Lab Corporation. All rights reserved.

(() => {
  'use strict';

  const makeQuery = require('./database').makeQuery;
  const bluebird = require('bluebird');

  class Message {
    static findById(id, done) {
      bluebird.coroutine(function *() {
        try {
          const messages = yield makeQuery('SELECT * FROM messages INNER JOIN users ON messages.uid = users.id WHERE mid = $1',
              [id]);
          if (messages.length > 0) {
            return done(null, messages[0]);
          }
          return done(null, null);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }

    static get(offset, amount, done) {
      bluebird.coroutine(function *() {
        try {
          const messages = yield makeQuery(
              'SELECT * FROM messages INNER JOIN users ON messages.uid = users.id ORDER BY mid DESC LIMIT $1 OFFSET $2',
              [amount, offset]);
          return done(null, messages);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }

    static create(uid, text, done) {
      bluebird.coroutine(function *() {
        try {
          const messages = yield makeQuery(
              'INSERT INTO messages (uid, text, created, updated) VALUES ($1, $2, $3, $4) RETURNING *',
              [uid, text, 'NOW()', 'NOW()']);
          return done(null, messages);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }

    static update(mid, text, done) {
      bluebird.coroutine(function *() {
        try {
          const messages = yield makeQuery(
              'UPDATE messages SET (text, updated) = ($1, $2) WHERE mid = $3 RETURNING *',
              [text, 'NOW()', mid]);
          return done(null, messages);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }

    static delete(mid, done) {
      bluebird.coroutine(function *() {
        try {
          const messages = yield makeQuery(
              'DELETE FROM messages WHERE mid = $1 RETURNING *',
              [mid]);
          return done(null, messages);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      })();
    }
  }

  module.exports = Message;
})();
