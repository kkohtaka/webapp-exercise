// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  'use strict';

  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');
  var mocha = require('gulp-mocha');
  var livereload = require('gulp-livereload');
  var notify = require('gulp-notify');
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
        './gulpfile.js',
        './test/**',
        './node_modules/**',
        './client/**'
      ],
      stdout: true,
    }).on('restart', function () {
      gulp.src('./bin/www')
      .pipe(livereload())
      .pipe(notify('Reloading page, please wait...'));
    });
  });

  gulp.task('watch', function () {
    gulp.watch(
      [
        './app.js',
        './routes/**/*.js',
        './views/**/*.js',
        './models/**/*.js',
        './test/**/*.js',
      ],
      ['mocha']
    );

    gulp.watch(
      [
        './client/javascripts/**/*.js',
      ],
      ['client-js']
    );
  });

  gulp.task('mocha', function () {
    return gulp.src('./test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    }));
  });

  gulp.task('test', function () {
    return gulp.src('./test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    }))
    .pipe(exit());
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

  gulp.task('client', ['client-js', 'client-css', 'client-fonts']);
  gulp.task('default', ['client', 'serve', 'mocha', 'watch']);
}());
