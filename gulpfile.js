require('es6-promise').polyfill();

var gulp = require('gulp'),
    browserify = require('browserify'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass')(require('sass')),
    uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge-stream'),
    postcss = require('gulp-postcss'),
    pxtorem = require('postcss-pxtorem'),
    autoprefixer = require('autoprefixer'),
    shell = require('gulp-shell'),
    replace = require('gulp-replace');

var cssProcessors = [
    autoprefixer(),
    pxtorem({
        rootValue: 14,
        replace: false,
        propWhiteList: []
    })
];

// JavaScript bundling task
function scripts() {
    // Bundle only the custom Jet code - jQuery, jQuery UI, Select2 loaded separately
    // Use browserify-shim to map requires to browser globals
    var bundler = browserify('./jet/static/jet/js/src/main.js', {
        // No standalone mode - we're not creating a UMD module
    })
    // Mark these as external so they're not bundled
    // browserify-shim (configured in package.json) will transform require() calls to window.jQuery etc
    .external('jquery')
    .external('jquery-ui/ui/core')
    .external('jquery-ui/ui/position')
    .external('jquery-ui/ui/widget')
    .external('jquery-ui/ui/widgets/mouse')
    .external('jquery-ui/ui/widgets/button')
    .external('jquery-ui/ui/widgets/datepicker')
    .external('jquery-ui/ui/widgets/dialog')
    .external('jquery-ui/ui/widgets/draggable')
    .external('jquery-ui/ui/widgets/droppable')
    .external('jquery-ui/ui/widgets/resizable')
    .external('jquery-ui/ui/widgets/sortable')
    .external('jquery-ui/ui/widgets/tooltip')
    .external('jquery-ui/ui/widgets/autocomplete')
    .external('select2')
    .external('timepicker');
    
    // Create unminified bundle
    var unminified = bundler.bundle()
        .on('error', function(error) {
            console.error('Browserify error:', error.message);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./jet/static/jet/js/build/'));
    
    // Create minified bundle
    var minified = bundler.bundle()
        .on('error', function(error) {
            console.error('Browserify error:', error.message);
            this.emit('end');
        })
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .on('error', function(error) {
            console.error('Buffer error:', error);
            this.emit('end');
        })
        .pipe(uglify())
        .on('error', function(error) {
            console.error('Uglify error:', error);
            this.emit('end');
        })
        .pipe(gulp.dest('./jet/static/jet/js/build/'))
        .on('error', function(error) {
            console.error('Dest error:', error);
            this.emit('end');
        });
    
    return merge(unminified, minified);
}

// SCSS compilation task
function styles() {
    return gulp.src('./jet/static/jet/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', function(error) {
            console.error(error);
        })
        .pipe(postcss(cssProcessors))
        .on('error', function(error) {
            console.error(error);
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./jet/static/jet/css'));
}

// Vendor styles task
function vendorStyles() {
    return merge(
        gulp.src('./node_modules/jquery-ui/themes/base/images/*')
            .pipe(gulp.dest('./jet/static/jet/css/jquery-ui/images/')),
        merge(
            gulp.src([
                './node_modules/select2/dist/css/select2.css',
                './node_modules/timepicker/jquery.ui.timepicker.css'
            ]),
            gulp.src([
                './node_modules/jquery-ui/themes/base/all.css'
            ])
                .pipe(cleanCSS()) // needed to remove jQuery UI comments breaking concatCss
                .on('error', function(error) {
                    console.error(error);
                })
                .pipe(concatCss('jquery-ui.css', {
                    rebaseUrls: false
                }))
                .on('error', function(error) {
                    console.error(error);
                })
                .pipe(replace('images/', 'jquery-ui/images/'))
                .on('error', function(error) {
                    console.error(error);
                }),
            gulp.src([
                './node_modules/perfect-scrollbar/src/css/main.scss'
            ])
                .pipe(sass({
                    outputStyle: 'compressed'
                }))
                .on('error', function(error) {
                    console.error(error);
                })
        )
            .pipe(postcss(cssProcessors))
            .on('error', function(error) {
                console.error(error);
            })
            .pipe(concatCss('vendor.css', {
                rebaseUrls: false
            }))
            .on('error', function(error) {
                console.error(error);
            })
            .pipe(cleanCSS())
            .on('error', function(error) {
                console.error(error);
            })
            .pipe(gulp.dest('./jet/static/jet/css'))
    )
}

// Vendor translations task
function vendorTranslations() {
    return merge(
        gulp.src(['./node_modules/jquery-ui/ui/i18n/*.js'])
            .pipe(gulp.dest('./jet/static/jet/js/i18n/jquery-ui/')),
        gulp.src(['./node_modules/timepicker/i18n/*.js'])
            .pipe(gulp.dest('./jet/static/jet/js/i18n/jquery-ui-timepicker/')),
        gulp.src(['./node_modules/select2/dist/js/i18n/*.js'])
            .pipe(gulp.dest('./jet/static/jet/js/i18n/select2/'))
    )
}

// Watch task
function watchFiles() {
    gulp.watch('./jet/static/jet/js/src/**/*.js', scripts);
    gulp.watch('./jet/static/jet/css/**/*.scss', styles);
    gulp.watch(['./jet/locale/**/*.po', './jet/dashboard/locale/**/*.po']);
}

// Export tasks for CLI usage
exports.scripts = scripts;
exports.styles = styles;
exports.vendorStyles = vendorStyles;
exports.vendorTranslations = vendorTranslations;
exports.watch = watchFiles;

// Build task runs all build steps in parallel
exports.build = gulp.parallel(scripts, styles, vendorStyles, vendorTranslations);

// Default task
exports.default = gulp.series(exports.build, watchFiles);
