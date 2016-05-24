// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var express = require('express');
  const passport = require('passport');
  var app = express();
  var router = express.Router();
  var pg = require('pg');

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() || (app.get('env') === 'test')) {
      return next();
    }
    return res.status(401).json({
      success: false,
    });
  };

  var util = require('util');

  var connectionString = util.format('postgres://%s:%s@%s:%s/%s',
      process.env.DATABASE_USER,
      process.env.DATABASE_PASS,
      process.env.DATABASE_HOST,
      process.env.DATABASE_PORT,
      process.env.DATABASE_NAME);

  /* GET lists messages. */
  router.get('/', function (req, res, next) {
    const offset = req.query.offset || 0;
    const amount = req.query.amount || 20;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      var messages = [];

      // TODO(kkohtaka): Implement paging.
      var query = client.query('SELECT * FROM messages ORDER BY mid DESC LIMIT $1 OFFSET $2',
          [amount, offset]);
      query.on('row', function (row) {
        messages.push(row);
      });

      query.on('error', function (err) {
        // TODO(kkohtaka): Check the reason why the error occurred.
        console.error(err);
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      });

      query.on('end', function (result) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.json({
          success: true,
          data: messages,
        });
      });
    });
  });

  /* GET gets the message. */
  router.get('/:mid', function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var mid = req.params.mid;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      // TODO(kkohtaka): Implement paging.
      var query = client.query('SELECT * FROM messages WHERE mid = $1',
          [mid]);

      var messages = [];
      query.on('row', function (row) {
        messages.push(row);
      });

      query.on('error', function (err) {
        // TODO(kkohtaka): Check the reason why the error occurred.
        console.error(err);
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      });

      query.on('end', function (result) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(messages.length > 0 ? 200 : 404).json({
          success: true,
          data: messages,
        });
      });
    });
  });

  /* POST creates a message. */
  router.post('/', ensureAuthenticated, function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var message = req.body;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      var query = client.query(
          'INSERT INTO messages (text, created, updated) VALUES ($1, $2, $3) RETURNING *',
          [message.text, 'NOW()', 'NOW()']);

      var messages = [];
      query.on('row', function (row) {
        messages.push(row);
      });

      query.on('error', function (err) {
        // TODO(kkohtaka): Check the reason why the error occurred.
        console.error(err);
        done();

        // TODO(kkohtaka): Design response format.
        return res.json({
          success: false,
          data: messages,
        });
      });

      query.on('end', function (result) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.json({
          success: true,
          data: messages,
        });
      });
    });
  });

  /* PUT updates the message. */
  router.put('/:mid', ensureAuthenticated, function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var mid = req.params.mid;
    var message = req.body;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      var query = client.query(
          'UPDATE messages SET (text, updated) = ($1, $2) WHERE mid = $3 RETURNING *',
          [message.text, 'NOW()', mid]);

      var messages = [];
      query.on('row', function (row) {
        messages.push(row);
      });

      query.on('error', function (err) {
        // TODO(kkohtaka): Check the reason why the error occurred.
        console.error(err);
        done();

        // TODO(kkohtaka): Design response format.
        return res.json({
          success: false,
          data: messages,
        });
      });

      query.on('end', function (result) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(result.rowCount > 0 ? 200 : 404).json({
          success: true,
          data: messages,
        });
      });
    });
  });

  /* DELETE removes the message. */
  router.delete('/:mid', ensureAuthenticated, function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var mid = req.params.mid;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      var query = client.query('DELETE FROM messages WHERE mid = $1', [mid]);

      var messages = [];
      query.on('row', function (row) {
        messages.push(row);
      });

      query.on('error', function (err) {
        // TODO(kkohtaka): Check the reason why the error occurred.
        console.error(err);
        done();

        // TODO(kkohtaka): Design response format.
        return res.json({
          success: false,
          data: messages,
        });
      });

      query.on('end', function (result) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(result.rowCount > 0 ? 200 : 404).json({
          success: true,
          data: messages,
        });
      });
    });
  });

  module.exports = router;
}());
