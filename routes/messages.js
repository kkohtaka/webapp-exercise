// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var express = require('express');
  var router = express.Router();
  var pg = require('pg');

  var util = require('util');

  var connectionString = util.format('postgres://%s:%s@%s:%s/%s',
      process.env.DATABASE_USER,
      process.env.DATABASE_PASS,
      process.env.DATABASE_HOST,
      process.env.DATABASE_PORT,
      process.env.DATABASE_NAME);

  /* GET lists messages. */
  router.get('/', function (req, res, next) {
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
      var query = client.query('SELECT * FROM messages ORDER BY id DESC');
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
  router.get('/:messageId', function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var messageId = req.params.messageId;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      // TODO(kkohtaka): Implement paging.
      var query = client.query('SELECT * FROM messages WHERE id = $1',
          [messageId]);

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
  router.post('/', function (req, res, next) {
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
  router.put('/:messageId', function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var messageId = req.params.messageId;
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
          'UPDATE messages SET (text, updated) = ($1, $2) WHERE id = $3 RETURNING *',
          [message.text, 'NOW()', messageId]);

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
  router.delete('/:messageId', function (req, res, next) {
    // TODO(kkohtaka): Validate input data.
    var messageId = req.params.messageId;
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();

        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }

      var query = client.query('DELETE FROM messages WHERE id = $1', [messageId]);

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
