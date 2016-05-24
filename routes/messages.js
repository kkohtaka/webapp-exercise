// Copyright 2016, Z Lab Corporation. All rights reserved.

(() => {
  'use strict';

  const express = require('express');
  const passport = require('passport');
  const bluebird = require('bluebird');
  const app = express();
  const router = express.Router();

  const User = require('../models/user');
  const Message = require('../models/message');

  const ensureAuthenticated = (req, res, next) => {
    if ((app.get('env') === 'test')) {
      req.user = {id: '0'};
      return next();
    }
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({
      success: false,
    });
  };

  /* GET lists messages. */
  router.get('/', (req, res, next) => {
    const offset = req.query.offset || 0;
    const amount = req.query.amount || 20;
    Message.get(offset, amount, (err, messages) => {
      if (err) {
        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }
      // TODO(kkohtaka): Design response format.
      return res.json({
        success: true,
        data: messages,
      });
    });
  });

  /* GET gets the message. */
  router.get('/:mid', (req, res, next) => {
    // TODO(kkohtaka): Validate input data.
    const mid = req.params.mid;
    Message.findById(mid, (err, message) => {
      if (err) {
        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }
      if (message) {
        // TODO(kkohtaka): Design response format.
        return res.json({
          success: true,
          data: message,
        });
      }
      return res.status(404).json({
        success: true,
      });
    });
  });

  /* POST creates a message. */
  router.post('/', ensureAuthenticated, (req, res, next) => {
    // TODO(kkohtaka): Validate input data.
    const message = req.body;
    const user = req.user;
    Message.create(user.id, message.text, (err, message) => {
      if (err) {
        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }
      // TODO(kkohtaka): Design response format.
      return res.json({
        success: true,
        data: message,
      });
    });
  });

  /* PUT updates the message. */
  router.put('/:mid', ensureAuthenticated, (req, res, next) => {
    // TODO(kkohtaka): Validate input data.
    const mid = req.params.mid;
    const message = req.body;
    Message.update(mid, message.text, (err, message) => {
      if (err) {
        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }
      // TODO(kkohtaka): Design response format.
      return res.json({
        success: true,
        data: message,
      });
    });
  });

  /* DELETE removes the message. */
  router.delete('/:mid', ensureAuthenticated, (req, res, next) => {
    // TODO(kkohtaka): Validate input data.
    const mid = req.params.mid;
    Message.delete(mid, (err, message) => {
      if (err) {
        // TODO(kkohtaka): Design response format.
        return res.status(500).json({
          success: false,
        });
      }
      if (message) {
        // TODO(kkohtaka): Design response format.
        return res.json({
          success: true,
          data: message,
        });
      }
      // TODO(kkohtaka): Design response format.
      return res.status(404).json({
        success: true,
      });
    });
  });

  module.exports = router;
})();
