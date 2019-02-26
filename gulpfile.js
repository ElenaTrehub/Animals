"use strict";

const gulp = require('gulp'),
      pug = require('gulp-pug'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      plumber = require('gulp-plumber'),
      prefix = require('gulp-autoprefixer'),
      imagemin = require('gulp-imagemin'),
      browserSync = require('browser-sync').create();

const useref = require('gulp-useref'),
      gulpif = require('gulp-if'),
      cleanCSS = require('gulp-clean-css'),
      uglify = require('gulp-uglify'),
      rimraf = require('rimraf'),
      notify = require("gulp-notify"),
      ftp = require( 'vinyl-ftp' );

const paths = {
    blocks: "blocks/",
    devDir: "app/",
    outputDir: "dist/"
}


gulp.task('pug', function(){

    return gulp.src([paths.blocks + '*.pug', '!' + paths.blocks + 'template.pug'])
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.devDir))
        .pipe(browserSync.stream())
});

gulp.task('sass', function(){
    return gulp.src(paths.blocks + '*.sass')
        .pipe(plumber())
        //.pipe(sass().on('error', sass.logError()))
        .pipe(prefix({
            browsers: ['last 10 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(paths.devDir + 'css/'))
        .pipe(browserSync.stream())
});

gulp.task('scripts', function(){
    return gulp.src([paths.blocks + '**/*.js', '!' + paths.blocks + '_assets/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.devDir + 'js/'))
        .pipe(browserSync.stream())
});

gulp.task('watch', function(){
    gulp.watch(paths.blocks + '**/*.pug', ['pug']);
    gulp.watch(paths.blocks + '**/*.sass', ['sass']);
    gulp.watch(paths.blocks + '**/*.js', ['scripts']);

});
gulp.task('browser-sync', function(){
    browserSync.init({
        port: 3000,
        server: {
            baseDir: paths.devDir
        }
    });
});


gulp.task('clean', function(cb){
    rimraf(paths.outputDir, cb);
});
gulp.task('build', ['clean'], function(){
    return gulp.src(paths.devDir + '*.html')
        .pipe(useref())
        .pipe( gulpif('*.js', uglify()))
        .pipe( gulpif('*.css', cleanCSS()))
        .pipe( gulp.dest(paths.outputDir));
});

gulp.task('imgBuild', ['clean'], function () {
    return gulp.src(paths.devDir + 'img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(paths.outputDir + 'img/'));
});

gulp.task('fontsBuild', ['clean'], function(){
    return gulp.src(paths.devDir + '/fonts/*')
        .pipe(gulp.dest(paths.outputDir + 'fonts/'));
});

gulp.task('send', function(){
    const conn = ftp.create({
        host: '77.128.110.166',
        user: 'alexlabs',
        password: 'Arj4h00F9x',
        parallel: 5
    });


    const globs = [
    'build/**/*',
    'node_modules/**'
];

    return gulp.src(globs, {base: '.', buffer: false})
       // .pipe( conn.newer('/'))
        .pipe( conn.dest('/'))
        .pipe( notify("Dev site updated!"));

});

gulp.task('default', ['browser-sync','watch', 'pug', 'sass', 'scripts']);

gulp.task('prod', ['build', 'imgBuild', 'fontsBuild']);
