const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const gutil = require('gulp-util'); //fonctions utilitaires pour les plugins Gulp
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// Option autoprefixer
const autoprefixerOptions = {
    browsers: ['last 12 versions', '> 1%', 'Explorer >= 8', 'ie >= 8']
};


/* CSS
------------------------------------------*/

//Option Sass
/*const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded', //nested, expanded, compact, compressed
};*/

gulp.task('sass', function() {
    return $.rubySass('./static/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe($.autoprefixer(autoprefixerOptions))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./static/css'))
        .on('end', function(){
            gutil.log('La tâche SASS est terminée.');
        });
});

gulp.task('sass:watch', function () {
    gulp.watch('./static/sass/**/*.scss', ['sass']);
});

/* JS
------------------------------------------*/

gulp.task('jslint', function () {
    return gulp.src(['./static/js/**/*.js'])
        .pipe($.jslint({ /* this object represents the JSLint directives being passed down */ }))
        .pipe($.jslint.reporter( 'default' ));
});

//script paths
var jsVendorFiles = './static/js/vendor/*.js',
    jsDest = './static/js/dist';

gulp.task('vscripts', function() {
    return gulp.src(jsVendorFiles)
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest(jsDest))
        .pipe($.rename('lib.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(jsDest));
});

/*gulp.task('mainjs', function() {
    return gulp.src('./static/js/main.js')
        .pipe($.rename('main.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(jsDest));
});


gulp.task('js:watch', function () {
    gulp.watch('./static/js/!*.js', ['mainjs', 'tesljs']);
});*/

//Convert ES6 ode in all js files in src/js folder and copy to
//build folder as bundle.js
gulp.task('es6', function(){
    return browserify('./static/js/main.js',{debug:true}).transform(babelify, {
        presets: ['es2015'],
        sourceMaps:true
    })
        .bundle()
        .pipe(source('all.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./static/js/dist'))
        .pipe(gutil.noop())
})


/* IMG
------------------------------------------*/

gulp.task('img', function ()  {
    return gulp.src('./img/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('./img'));
});

/* DEFAULT
__________________________________________*/

gulp.task('default', function ()  {
    gulp.watch(['./static/js/**/*.js'], ['es6']);
    gulp.watch(['./static/sass/**/*.scss'], ['sass']);
});
