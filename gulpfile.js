// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');
  var mocha = require('gulp-mocha');
  var env = require('gulp-env');

  gulp.task('serve', function () {
    nodemon({
      script: './bin/www',
      ext: 'js',
      ignore: [
        'gulpfile.js',
        'node_modules/**',
      ],
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      stdout: false,
    }).on('restart', function () {
      console.log('Restarting...');
    });
  });

  gulp.task('watch', function () {
    gulp.watch(
      [
        'app.js',
        'routes/**/*.js',
        'views/**/*.js',
        'test/**/*.js',
      ],
      ['mocha']
    );
  });

  gulp.task('mocha', function () {
    env({
      vars: {
        NODE_ENV: 'test',
        PORT: 3001,
      },
    });
    return gulp.src('test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    }));
  });

  gulp.task('default', ['serve', 'mocha', 'watch']);
}());
