// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');
  var mocha = require('gulp-mocha');
  var env = require('gulp-env');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var livereload = require('gulp-livereload');
  var notify = require('gulp-notify');
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');

  gulp.task('serve', function () {
    livereload.listen();
    nodemon({
      script: './bin/www',
      ext: 'js',
      ignore: [
        './gulpfile.js',
        './test/**/*.js',
        './node_modules/**',
      ],
      env: {
        NODE_ENV: 'development',
        PORT: '3000',
        DATABASE_USER: 'docker',
        DATABASE_PASS: 'docker',
        DATABASE_HOST: '192.168.99.100',
        DATABASE_PORT: '5432',
        DATABASE_NAME: 'development',
      },
      stdout: false,
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
  });

  gulp.task('mocha', function () {
    env({
      vars: {
        NODE_ENV: 'test',
        PORT: 3001,
        DATABASE_USER: 'docker',
        DATABASE_PASS: 'docker',
        DATABASE_HOST: '192.168.99.100',
        DATABASE_PORT: '5433',
        DATABASE_NAME: 'test',
      },
    });
    return gulp.src('./test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    }));
  });

  gulp.task('client-js', function () {
    browserify({
      entries: [
        './node_modules/bootstrap/dist/js/npm.js',
      ],
      debug: true,
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/javascripts'));
  });

  gulp.task('client', ['client-js']);
  gulp.task('default', ['client', 'serve', 'mocha', 'watch']);
}());
