var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var imageminWebp = require('imagemin-webp');
var imageminMozjpeg = require('imagemin-mozjpeg');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var handlebars = require('gulp-compile-handlebars');

gulp.task('handlebars', function() {
	console.log('\x1b[31m', ' 👍   handlebars   👌', '\x1b[0m');
	var templateData = {},
		options = {
			ignorePartials: true,
			batch: ['assets/handlebars']
		};
	gulp.src('assets/handlebars/**/*.html')
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(handlebars(templateData, options))
		.pipe(gulp.dest('./assets/html'));
	return gulp
		.src('source/**/*.html')
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(handlebars(templateData, options))
		.pipe(gulp.dest('./build'));
});

gulp.task('browserSync', function() {
	browserSync.init({
		watch: true,
		server: './build',
		watchOptions: {
			awaitWriteFinish: true
		}
	});
});

gulp.task('fonts', function() {
	console.log('\x1b[31m', ' 👍   fonts   👌', '\x1b[0m');
	return gulp.src('assets/fonts/*.{eot,svg,ttf,woff,woff2}').pipe(gulp.dest('build/assets/fonts/'));
});

gulp.task('stylesheets', function() {
	console.log('\x1b[31m', ' 👍   stylesheets   👌', '\x1b[0m');
	return gulp
		.src('assets/scss/style.scss')
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 version'))
		.pipe(
			cssnano({
				reduceIdents: false
			})
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/assets/css'));
});

gulp.task('scripts', function() {
	console.log('\x1b[31m', ' 👍   scripts   👌', '\x1b[0m');
	return gulp
		.src(['assets/js/site.js'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/assets/js'));
});

gulp.task('images', function() {
	console.log('\x1b[31m', ' 👍   images   👌', '\x1b[0m');
	return gulp
		.src('assets/img/**/*')
		.pipe(
			imagemin([
				imagemin.svgo({
					plugins: [{ removeUselessDefs: false }, { removeViewBox: false }, { cleanupIDs: false }, { removeUselessStrokeAndFill: false }]
				}),
				imagemin.gifsicle(),
				imageminMozjpeg({
					quality: 75
				}),
				imagemin.optipng()
			])
		)
		.pipe(gulp.dest('./build/assets/img'));
});

gulp.task('webp', function() {
	console.log('\x1b[31m', ' 👍   webp   👌', '\x1b[0m');
	return gulp
		.src(['assets/img/**/*.{jpg,png}'])
		.pipe(imagemin([imageminWebp({ preset: 'photo' })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(gulp.dest('./build/assets/img'));
});

gulp.task('default', ['browserSync', 'stylesheets', 'handlebars', 'scripts', 'images', 'webp', 'fonts'], function() {
	console.log('\x1b[31m', ' 👍   default   👌', '\x1b[0m');
	gulp.watch('assets/scss/**/*.scss', ['stylesheets']);
	gulp.watch('assets/js/**/*.js', ['scripts']);
	gulp.watch('assets/img/**/*', ['images']);
	gulp.watch('assets/fonts/**/*', ['fonts']);
	gulp.watch('assets/img/**/*.jpg', ['webp']);
	gulp.watch('assets/handlebars/**/*.html', ['handlebars']);
	gulp.watch('source/**/*.html', ['handlebars']);
});

gulp.task('build', ['handlebars', 'stylesheets', 'scripts', 'images', 'fonts', 'webp'], function() {});
