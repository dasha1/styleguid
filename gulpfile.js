'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    pug = require('gulp-pug'),
    rimraf = require('rimraf'),
    rigger = require('gulp-rigger'),
    reload = browserSync.reload;
var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        pug:'app/'
    },
    src: {
        html: 'app/*.html',
        js: 'app/js/main.js',
        style: 'app/style/main.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*',
        pug: 'app/pug/**/*.pug'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/style/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*',
        pug: 'app/pug/**/*.pug'
    },
    clean: './dist'
};
var config = {
    server: {
        baseDir: "./dist"
    },
    host: 'localhost',
    port: 9000
};
gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
gulp.task('pug:dist', function() {
    return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist.pug))
        .pipe(reload({stream: true}));
});
gulp.task('html:dist', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream: true}));
});
gulp.task('js:dist', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:dist', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['app/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(rigger())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:dist', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:dist', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});
gulp.task('dist', [
    'html:dist',
    'js:dist',
    'style:dist',
    'fonts:dist',
    'image:dist',
    'pug:dist'
]);
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:dist');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:dist');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:dist');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:dist');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:dist');
    });
    watch([path.watch.pug], function(event, cb) {
        gulp.start('pug:dist');
    });
});


gulp.task('default', ['dist', 'webserver', 'watch']);