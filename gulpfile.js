const gulp = require('gulp');
const newer = require('gulp-newer');
const { spawn } = require('child_process');
const cssMin = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const { argv } = require('yargs');
const gulpif = require('gulp-if');

const env = argv.dev
    ? 'development'
    : 'production';

const isProd = env === 'production';

console.log('Gulp env:', env);

gulp.task('default', ['js', 'css', 'html']);
gulp.task('watch', () => {
    browserSync.init({ server: 'dist' });

    gulp.watch('src/**/*.scss', ['css']);
    gulp.watch('src/**/*.pug', ['html']);

    gulp.watch('dist/**/*.html').on('change', browserSync.reload);
    gulp.watch('dist/**/*.js').on('change', browserSync.reload);
});

gulp.task('clean', () => {
    return gulp.src('dist', { read: false }).pipe(clean());
});

gulp.task('js', cb => {
    let done = false;
    function exit(err) {
        if (!done) {
            done = true;
            cb(err);
        }
    }

    const process = spawn(`set NODE_ENV=${env} && webpack`, { shell: true });
    process.stdout.on('data', data => console.log(data.toString('utf8')));
    process.stderr.on('data', data => {
        console.log(data.toString('utf8'));
        exit(new Error('Webpack failed'));
    });

    process.on('close', (code) => {
        if (code) {
            exit(new Error('Webpack finished with non-zero exit code'));
        } else exit();
    });
});

gulp.task('css', () => {
    return gulp.src('src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(isProd, cssMin()))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./', { sourceRoot: '/styles' }))
        .pipe(gulp.dest('dist'))
        .pipe(gulpif(!isProd, browserSync.stream()));
});

gulp.task('html', () => {
    return gulp.src('src/**/*.pug')
        .pipe(newer({ dest: 'dist', ext: '.html' }))
        .on('data', () => console.log('a'))
        .pipe(pug())
        .pipe(gulp.dest('./dist'));
});
