const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const fs = require('fs');

// Server task
gulp.task('server', function() {
    console.log('Starting server...');
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        browser: 'chrome',
        notify: false
    });
    console.log('Server started.');
});

// Styles task
gulp.task('styles', function() {
    console.log('Compiling styles...');
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// HTML task
gulp.task('html', function() {
    console.log('Minifying HTML...');
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/'));
});

// Scripts task
gulp.task('scripts', function() {
    console.log('Copying scripts...');
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

// Fonts task
gulp.task('fonts', function(done) {
    console.log('Copying fonts...');
    if (fs.existsSync('src/fonts') && fs.readdirSync('src/fonts').length > 0) {
        return gulp.src("src/fonts/**/*")
            .pipe(gulp.dest('dist/fonts'))
            .pipe(browserSync.stream());
    } else {
        console.log('No fonts to copy.');
        done();
    }
});

// Icons task
gulp.task('icons', function(done) {
    console.log('Copying icons...');
    if (fs.existsSync('src/icons') && fs.readdirSync('src/icons').length > 0) {
        return gulp.src("src/icons/**/*")
            .pipe(gulp.dest('dist/icons'))
            .pipe(browserSync.stream());
    } else {
        console.log('No icons to copy.');
        done();
    }
});

// Images task
gulp.task('images', function() {
    console.log('Optimizing images...');
    return gulp.src("src/img/**/*", {
        encoding: false
    })
        .pipe(imagemin())
        .on('error', function(err) {
            console.error('Error in images task', err.toString());
        })
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
});



// gulp.task('images', function() {
//     console.log('Optimizing images...');
//     return gulp.src("src/img/**/*")
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/img'))
//         .pipe(browserSync.stream());
// });

// Watch task
gulp.task('watch', function() {
    console.log('Starting watch task...');
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.series('styles'));
    gulp.watch("src/*.html").on('change', gulp.series('html', browserSync.reload));
    gulp.watch("src/js/**/*.js").on("change", gulp.series('scripts', browserSync.reload));
    gulp.watch("src/fonts/**/*").on("all", gulp.series('fonts', browserSync.reload));
    gulp.watch("src/icons/**/*").on("all", gulp.series('icons', browserSync.reload));
    gulp.watch("src/img/**/*").on("all", gulp.series('images', browserSync.reload));
    console.log('Watch task started.');
});

// Sequential task execution
gulp.task('default', gulp.series(
    gulp.parallel('styles', 'html', 'scripts', 'fonts', 'icons', 'images'),
    gulp.parallel('server', 'watch')
));
