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
  var exit = require('gulp-exit');
  var browserify = require('browserify');
  var babelify = require('babelify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');

  var environments = {
    test: {
      NODE_ENV: 'test',
      PORT: 3001,
      DATABASE_USER: 'postgres',
      DATABASE_PASS: '',
      DATABASE_HOST: '192.168.99.100',
      DATABASE_PORT: '5432',
      DATABASE_NAME: 'test',
    },
    development: {
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_USER: 'postgres',
      DATABASE_PASS: '',
      DATABASE_HOST: '192.168.99.100',
      DATABASE_PORT: '5433',
      DATABASE_NAME: 'development',
      GOOGLE_CONSUMER_KEY: '206888294905-qvs2m4oudqq7k5cpac4vc6lf1racaffh.apps.googleusercontent.com',
      GOOGLE_CONSUMER_SECRET: 'avGpzlPDF-vcLhhl4AB4c68w',
      GOOGLE_OAUTH_CALLBACK_URL: 'http://localhost:3000/auth/google/callback'
    }
  }
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
      env: environments.development,
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

    gulp.watch(
      [
        './client/javascripts/**/*.js',
      ],
      ['client-js']
    );
  });

  gulp.task('mocha', function () {
    env({
      vars: environments.test,
    });
    return gulp.src('./test/**/*.js')
    .pipe(mocha({
      bail: false,
      reporter: 'spec',
    }));
  });

  gulp.task('test', function () {
    env({
      vars: environments.test,
    });
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
    .pipe(source('bundle.js'))
    // .pipe(buffer())
    // .pipe(sourcemaps.init({
    //   loadMaps: true,
    // }))
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
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
