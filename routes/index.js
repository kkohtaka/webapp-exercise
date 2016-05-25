// Copyright 2016, Z Lab Corporation. All rights reserved.

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');

/* GET home page. */
router.get('/', (req, res, next) => {
  const user = req.user || {};
  res.render('index', {
    title: 'Web Application Exercise',
    name: user.name,
    imageURL: user.email ? gravatar.url(user.email, {s:'32'}) : null,
  });
});

module.exports = router;
