// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');

  gulp.task('serve', function () {
    nodemon({
      script: './bin/www',
      ext: 'js',
      ignore: ['gulpfile.js'],
      env: {
        NODE_ENV: 'development',
      },
      stdout: false,
    });
  });

  gulp.task('default', ['serve']);
}());
