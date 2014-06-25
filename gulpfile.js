var gulp = require('gulp')
  , less = require('gulp-less')
  , plumber = require('gulp-plumber')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')
  , bootstrap = require('./bootstrap/build')
  , fs = require('fs');

gulp.task('bootstrap', bootstrap);

gulp.task('less', function(){
    gulp.src('./styles/site.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('libs', function () {
    var bundle = browserify();

    bundle.require('react')
    bundle.require('react-bootstrap')
    bundle.require('lodash')
    bundle.require('bluebird')

    bundle.bundle({ debug: true })
        .on("error", handleError)
        .pipe(source('lib.js'))
        .pipe(plumber())
        .pipe(gulp.dest('./public/js'))

});

gulp.task('app', function(){
    var bundle = browserify();

    bundle.add('./app/app.jsx') 
    bundle.transform('reactify')
    bundle.external('react')
    bundle.external('react-bootstrap')
    bundle.external('lodash')
    bundle.external('bluebird')

    bundle.bundle({ debug: true })
        .on("error", handleError)
        .pipe(source('app.js'))
        .pipe(plumber())
        .pipe(gulp.dest('./public/js'))
        
});

gulp.task('watch', function() {
    gulp.watch('./bootstrap/**/*', ['bootstrap']);
    gulp.watch('./styles/**/*.less', ['less']);
    gulp.watch('./app/**/*', ['browserify']);
});

// Default Task
gulp.task('browserify', ['libs', 'app']);
gulp.task('default', ['browserify', 'less', 'bootstrap']);

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}