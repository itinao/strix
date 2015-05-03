/**
 * ビルドスクリプト
 */

// config
// *** webroot側
var webBase                = 'webroot/';
var webSassFiles           = webBase + 'scss/*.scss';
var webSassBuildDir        = webBase + 'build/css/';
var webHtmlFiles           = webBase + 'html/*.html';
var webHtmlBuildDir        = webBase + '/';

// requires
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var vulcanize = require('gulp-vulcanize');
var minifyInline = require('gulp-minify-inline');
var runSequence = require('run-sequence');


/**
 * タスク
 */
// web用cssの生成
gulp.task('build-web-sass', function() {
  return gulp.src(webSassFiles)
  .pipe(sass())
  .pipe(gulp.dest(webSassBuildDir))
  .pipe(minifyCss())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest(webSassBuildDir));
});

// web用htmlの生成の実行
gulp.task('build-web-html', function() {
  // {spare: false, empty: true}にしないとpolymerのLayout機能と折り合わない
  var minifyHtmlOption = {comments: false, quotes: true, spare: false, empty: true};
  gulp.src(webHtmlFiles)
  .pipe(vulcanize({dest: webHtmlBuildDir}))
  .pipe(minifyInline())
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest(webHtmlBuildDir));
});

// ウォッチャー
gulp.task('build-web-watch', function() {
  gulp.watch(webSassFiles, function(event) {
    gulp.run('build-web-sass');
  });
  gulp.watch(webHtmlFiles, function(event) {
    gulp.run('build-web-html');
  });
});

// 全て実行
gulp.task('build-web', ['build-web-sass', 'build-web-html']);
