'use strict';

var gulp          = require('gulp');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var browserSync   = require('browser-sync');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var connect       = require('gulp-connect-php');
var cssnano       = require('gulp-cssnano');
var rename        = require('gulp-rename');
var plumber       = require('gulp-plumber');
var del           = require('del');
var zip           = require('gulp-zip');
var gutil         = require('gulp-util');
var ftp           = require('vinyl-ftp');
var urlUtil       = require('url');


/**  
 * Replace Variable Values Below 
 */

var URL             = 'http://yoursite.com';
var dist_themename  = 'NAME-OF-THEME-FOLDER';
var ftpUploadDir    = '/public_html/path-to-upload-theme-folder/'+dist_themename;
var ftpCredentials = {
    ftphost: 'HOST',
    ftpuser: 'USER',
    ftppassword: 'PASSWORD'
};

/* --End-- */


var parsedUrl = urlUtil.parse(URL);
var hostname = parsedUrl.hostname;
var host = parsedUrl.host;
var port = parsedUrl.port || 80;

var paths = {
    scripts: 'js/**/*.js',
    images: 'images/**/*',
    styles: 'sass/**/*.scss',
    php: './**/*.php'
}; 

var conn = ftp.create( {
    host:     ftpCredentials.ftphost,
    user:     ftpCredentials.ftpuser,
    password: ftpCredentials.ftppassword,
    log:      gutil.log
});

var build_files = [
  '**',
  '!node_modules',
  '!node_modules/**',
  '!bower_components',
  '!bower_components/**',
  '!sass',
  '!sass/**',
  '!js',
  '!js/**',
  '!.git',
  '!.git/**',
  '!package.json',
  '!bower.json',
  '!.gitignore',
  '!Gulpfile.js',
  '!.editorconfig',
  '!.jshintrc',
  '!.jscsrc',
  '!.jshintignore',
  '!*.txt',
  '!*.md',
  '!dist',
  '!dist/**'
];


gulp.task('jsmin', function() { 
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});


gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});


gulp.task('cssmin', ['clean-css', 'styles'], function () {
  return gulp.src('assets/css/*.css')
    .pipe(cssnano({safe: true, autoprefixer: false}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});


gulp.task('clean-css', del.bind(null, ['assets/css/*.min.css']));


gulp.task('bs-sync', function() {
  connect.server({
    port: parseInt(port) + 1,
    hostname: hostname,
    base: '../../../', // default for a wordpress install
    open: false
  }, function() {
    browserSync({
      host: hostname,
      proxy: host,
      port: port
    });
  });
});


gulp.task('reload-scripts', ['scripts', 'jsmin'], browserSync.reload);


gulp.task('watch', function() {
  gulp.watch(paths.styles, ['cssmin']);
  gulp.watch(paths.scripts, ['reload-scripts']);
  gulp.watch(paths.php).on('change', browserSync.reload);
});


gulp.task('serve', ['bs-sync', 'watch']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', [  'jsmin', 'cssmin' ]);



/* Build theme for production */

gulp.task('build-clean', function() {
  del.sync(['dist/**/*']);
});


gulp.task('build-theme', function() {
  return gulp.src(build_files)
    .pipe(gulp.dest('dist/'+dist_themename));
});


gulp.task('build-zip', ['build-theme'], function() {
  return gulp.src('dist/**/*')
    .pipe(zip(dist_themename+'.zip'))
    .pipe(gulp.dest('dist'));
});


gulp.task('build', ['build-clean'], function() {
  gulp.start('build-zip');
});



/* Upload to FTP Server */

gulp.task( 'deploy', function() {
  return gulp.src( build_files, { base: '.', buffer: false } )
      .pipe( conn.newer( ftpUploadDir ) ) // only upload newer files
      .pipe( conn.dest( ftpUploadDir ) );
});

gulp.task( 'deploy-clean', function ( cb ) {
    conn.rmdir( ftpUploadDir, cb );
});