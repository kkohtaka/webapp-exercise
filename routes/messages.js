// Copyright 2016, Z Lab Corporation. All rights reserved.

var express = require('express');
var router = express.Router();

/* GET lists messages. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET gets the message. */
router.get('/:messageId', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST creates a message. */
router.post('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* PUT updates the message. */
router.put('/:messageId', function (req, res, next) {
  res.send('respond with a resource');
});

/* DELETE removes the message. */
router.delete('/:messageId', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
