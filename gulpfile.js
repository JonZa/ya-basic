// Requiring Gulp
var gulp = require('gulp');

// Requires the gulp-sass plugin
var sass = require('gulp-sass');

// Requiring autoprefixer
var autoprefixer = require('gulp-autoprefixer');

// Requiring sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// Requiring browser-sync
var browserSync = require('browser-sync');

// Requiring concat
var concat = require('gulp-concat');

// Requiring imagemin
var imagemin = require('gulp-imagemin');
var imageminWebp = require('imagemin-webp');
var imageminMozjpeg = require('imagemin-mozjpeg');

// Requiring cssnano
var cssnano = require('gulp-cssnano');

// Requiring uglify
var uglify = require('gulp-uglify-es').default;

// Requiring rename
var rename = require('gulp-rename');

// Plumber
var plumber = require('gulp-plumber');

// Notify
var notify = require('gulp-notify');

var handlebars = require('gulp-compile-handlebars');

gulp.task('handlebars', function () {
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

// Start browserSync server
gulp.task('browserSync', function () {
	browserSync.init({
		watch: true,
		server: './build',
		watchOptions: {
			awaitWriteFinish: true
		}
	});
});

// Copy fonts task
gulp.task('fonts', function () {
	console.log('\x1b[31m', ' 👍   fonts   👌', '\x1b[0m');
	return gulp.src('assets/fonts/*.{eot,svg,ttf,woff,woff2}').pipe(gulp.dest('build/assets/fonts/'));
});

// Start stylesheets task
gulp.task('stylesheets', function () {
	console.log('\x1b[31m', ' 👍   stylesheets   👌', '\x1b[0m');
	return gulp
		.src('assets/scss/style.scss') // Get all *.scss files
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(sass().on('error', sass.logError)) // Compiling sass
		.pipe(autoprefixer('last 2 version')) // Adding browser prefixes
		.pipe(
			cssnano({
				reduceIdents: false
			})
		) // Compress
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/assets/css'));
});

// Start scripts task

gulp.task('scripts', function () {
	console.log('\x1b[31m', ' 👍   scripts   👌', '\x1b[0m');
	return gulp
		.src(['assets/js/site.js'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/assets/js'));
});

// Start images task
gulp.task('images', function () {
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
// Start webp task
gulp.task('webp', function () {
	console.log('\x1b[31m', ' 👍   webp   👌', '\x1b[0m');
	return gulp
		.src(['assets/img/**/*.{jpg,png}'])
		.pipe(imagemin([imageminWebp({ preset: 'photo' })]))
		.pipe(rename({ extname: '.webp' }))
		.pipe(gulp.dest('./build/assets/img'));
});

// Start watch groups of tasks
gulp.task('default', ['browserSync', 'stylesheets', 'handlebars', 'scripts', 'images', 'webp', 'fonts'], function () {
	console.log('\x1b[31m', ' 👍   default   👌', '\x1b[0m');
	gulp.watch('assets/scss/**/*.scss', ['stylesheets']); // Watch for SCSS changes
	gulp.watch('assets/js/**/*.js', ['scripts']); // Watch for JS changes
	gulp.watch('assets/img/**/*', ['images']); // Watch for image changes
	gulp.watch('assets/fonts/**/*', ['fonts']); // Watch for font changes
	gulp.watch('assets/img/**/*.jpg', ['webp']); // Watch for jpg changes
	gulp.watch('assets/handlebars/**/*.html', ['handlebars']); // Watch for template changes
	gulp.watch('source/**/*.html', ['handlebars']); // Watch for template changes
});

// Start build task
gulp.task('build', ['handlebars', 'stylesheets', 'scripts', 'images', 'fonts', 'webp'], function () { });
