// Load plugins

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    prefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    uncss = require('gulp-uncss'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload,
    csslint = require('gulp-csslint');


// Task to minify all css files in the css directory


// Task to optmize and minify images

gulp.task('minify-img', function() {
  return gulp.src('./img/*')
    .pipe((imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./img'));
});


// Task to optimize and minify svg

gulp.task('minify-svg', function(){
  gulp.src('./img/svg')
          .pipe(svgmin())
          .pipe(gulp.dest('./img/svg'));
});


// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./sass/beats.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass())
          .pipe(size({gzip: false, showFiles: true, title:'un-prefixed css'}))
          .pipe(size({gzip: true, showFiles: true, title:'un-prefixed gzipped css'}))
          .pipe(prefix())
          .pipe(size({gzip: false, showFiles: true, title:'prefixed css'}))
          .pipe(size({gzip: true, showFiles: true, title:'prefixed css'}))
          .pipe(gulp.dest('css'))
          .pipe(browserSync.reload({stream:true}));
      }));
});

gulp.task('concat', function() {
  gulp.src(['site/style.css', 'css/beats.css'])
    .pipe(concat('site.css'))
    .pipe(gulp.dest('./css/'))
});

gulp.task('concat-js', function() {
  gulp.src(['angular.min.js', 'plangular.js'])
    .pipe(concat('site.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
});

gulp.task('minify-css', function(){
  gulp.src(['css/site.css'])
    .pipe(uncss({
      html: ['index.html'],
      ignore: [':hover', ':focus', ':visited', ':link', ':active', ':before', ':after']
    }))
    .pipe(minifyCSS())
    .pipe(rename('site.min.css'))
    .pipe(gulp.dest('./css/'))
    .pipe(size({gzip: false, showFiles: true, title:'minified css'}))
    .pipe(size({gzip: true, showFiles: true, title:'minified css'}));
});


gulp.task('csslint', function(){
  gulp.src('./css/beats.css')
    .pipe(csslint({
          'compatible-vendor-prefixes': false,
          'box-sizing': false,
          'important': false,
          'known-properties': false
        }))
    .pipe(csslint.reporter());
});

// Initialize browser-sync which starts a static server also allows for
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        }
    });
});

// Function to call for reloading browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/*
   DEFAULT TASK

 • Process sass and lints outputted css
 • Outputted css is run through autoprefixer
 • Sends updates to any files in directory to browser for
 automatic reloading

*/

gulp.task('default', ['pre-process', 'minify-css', 'bs-reload', 'browser-sync'], function(){
  gulp.start('pre-process', 'csslint');
  gulp.watch('sass/*.scss', ['pre-process']);
  gulp.watch('css/beats.css', ['bs-reload']);
  gulp.watch(['*.html'], ['bs-reload']);
});

