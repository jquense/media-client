var gulp = require('gulp')
  , less = require('gulp-less')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')
  , fs = require('fs');

gulp.task('less', function(){
    gulp.src('./styles/*.less')
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
        .pipe(source('lib.js'))
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
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js'))
        
});

gulp.task('watch', function() {
    gulp.watch('./app/**/*', ['browserify']);
});

// Default Task
gulp.task('browserify', ['libs', 'app']);
gulp.task('default', ['browserify', 'less']);