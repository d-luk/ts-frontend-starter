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
const rename = require('gulp-rename');
const clean = require('gulp-clean');

const env = argv.dev
    ? 'development'
    : 'production';

const isProd = env === 'production';

console.log('Gulp env:', env);

gulp.task('default', ['js', 'css', 'html', 'static']);

gulp.task('serve-dev', ['js', 'css', 'html', 'static'], () => {
    gulp.watch('src/styles/**/*.scss', ['css']);
    gulp.watch('src/index.pug', ['html']);
    gulp.watch('src/static/**/*', ['static']);

    runWebpack(err => {
        if (err) throw err;
    }, { watch: true });

    gulp.watch('dist/index.html').on('change', browserSync.reload);
    gulp.watch('dist/**/*.js').on('change', browserSync.reload);

    browserSync.init({ server: 'dist' });
});

gulp.task('clean', () => {
    const dir = 'dist';
    console.log('Cleaning', dir);

    return gulp.src(dir, { read: false })
        .pipe(clean());
});

function runWebpack(cb, options = {}) {
    let cmd = `set NODE_ENV=${env} && webpack`;
    if (options.watch) cmd += ' --watch';

    let done = false;
    function exit(err) {
        if (!done) {
            done = true;
            cb(err);
        }
    }

    const process = spawn(cmd, { shell: true });
    process.stdout.on('data', data => console.log(data.toString('utf8')));
    process.stderr.on('data', data => {
        console.error(data.toString('utf8'));
        exit(new Error('Webpack failed'));
    });

    process.on('close', code => {
        if (code) exit(new Error('Webpack finished with non-zero exit code'));
        else exit();
    });
}

gulp.task('js', cb => runWebpack(cb));

gulp.task('css', () => {
    return gulp.src('src/styles/index.scss')
        .pipe(sourcemaps.init())
        .pipe(rename({ basename: 'style' }))
        .pipe(newer({ dest: 'dist', extra: 'src/styles/**/*.scss' }))
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
        .pipe(pug())
        .pipe(gulp.dest('./dist'));
});

gulp.task('static', () => {
    return gulp.src('src/static/**/*')
        .pipe(newer('dist'))
        .pipe(gulp.dest('dist'));
});
