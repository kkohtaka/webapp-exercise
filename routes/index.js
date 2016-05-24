// Copyright 2016, Z Lab Corporation. All rights reserved.

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('user:', req.user);
  res.render('index', { title: 'Web Application Exercise' });
});

module.exports = router;
