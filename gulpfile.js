// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  'use strict';

  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');
  var webserver = require('gulp-webserver');
  var mocha = require('gulp-mocha');
  var istanbul = require('gulp-istanbul');
  var livereload = require('gulp-livereload');
  var exit = require('gulp-exit');
  var browserify = require('browserify');
  var babelify = require('babelify');
  var source = require('vinyl-source-stream');

  gulp.task('serve', function () {
    livereload.listen();
    nodemon({
      script: './bin/www',
      ext: 'js, jade',
      ignore: [
        'gulpfile.js',
        'system-test/',
        'node_modules/',
      ],
      stdout: true,
    }).on('restart', function () {
      gulp.src('./bin/www')
      .pipe(livereload());
    });
  });

  gulp.task('coverage', function () {
    gulp.src('coverage')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 3000,
      livereload: true,
    }))
  });

  gulp.task('watch-and-run-system-test', function () {
    gulp.watch(
      [
        './app.js',
        './routes/**/*.js',
        './views/**/*.js',
        './models/**/*.js',
        './system-test/**/*.js',
      ],
      ['run-system-test']
    );
  });

  gulp.task('watch-and-run-unit-test', function () {
    gulp.watch(
      [
        './app.js',
        './routes/**/*.js',
        './views/**/*.js',
        './models/**/*.js',
        './system-test/**/*.js',
      ],
      ['run-unit-test']
    );
  });

  gulp.task('watch-client-src', function () {
    gulp.watch(
      [
        './client/javascripts/**/*.js',
      ],
      ['client-js']
    );
    gulp.watch(
      [
        './client/stylesheets/**/*.css',
      ],
      ['client-css']
    );
  });

  gulp.task('run-system-test', function () {
    return gulp.src('./system-test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    }));
  });

  gulp.task('run-unit-pre-test', function () {
    return gulp.src([
      './app.js',
      './routes/**/*.js',
      './models/**/*.js',
    ]).pipe(istanbul())
    .pipe(istanbul.hookRequire());
  });

  gulp.task('run-unit-test', ['run-unit-pre-test'], function () {
    return gulp.src('./system-test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    })).pipe(istanbul.writeReports({
      dir: './coverage',
      reporters: ['lcov', 'json', 'text', 'text-summary', 'html'],
    })).pipe(istanbul.enforceThresholds({
      thresholds: { global: 90 },
    }));
  });

  gulp.task('client-js', function () {
    browserify({
      entries: [
        './client/javascripts/main.js',
      ],
      debug: true,
    })
    .transform(babelify)
    .bundle()
    .on('error', function (err) {
      console.error(err.message);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/javascripts'));
  });

  gulp.task('client-css', function () {
    gulp.src([
      './client/stylesheets/**/*.css',
      './node_modules/bootstrap/dist/css/**',
    ])
    .pipe(gulp.dest('./public/stylesheets'));
  });

  gulp.task('client-fonts', function () {
    gulp.src([
      './node_modules/bootstrap/dist/fonts/**',
    ])
    .pipe(gulp.dest('./public/fonts'));
  });

  gulp.task('default', ['client', 'serve']);
  gulp.task('client', ['client-js', 'client-css', 'client-fonts']);
  gulp.task('system-test', ['watch-and-run-system-test']);
  gulp.task('unit-test', ['coverage', 'watch-and-run-unit-test']);
}());
