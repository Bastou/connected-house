const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const gutil = require('gulp-util'); //fonctions utilitaires pour les plugins Gulp
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const assign = require('lodash.assign');

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
        //.pipe($.uglify())
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


//Convert ES6 ode in all js files in src/js folder and copy to
//build folder as bundle.js
// gulp.task('es6', function(){
//     return browserify('./static/js/main.js',{debug:true}).transform(babelify, {
//         presets: ['es2015'],
//         sourceMaps:true
//     })
//         .bundle()
//         .pipe(source('all.js'))
//         .pipe(buffer())
//         .pipe($.sourcemaps.init({loadMaps: true}))
//         .pipe($.uglify())
//         .pipe($.sourcemaps.write('./'))
//         .pipe(gulp.dest('./static/js/dist'))
//         .pipe(gutil.noop())
// })


// JAVASCRIPT:APP

// add custom browserify options here
var customOpts = {
    entries: ['./static/js/main.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)
// *** Transforms go here ***
    .transform(babelify, {
        presets: ['es2015'],
        sourceMaps:true
    }));
//var b = browserify(customOpts);

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('es6', bundle); // so you can run `gulp js` to build the file
//b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', function(msg){console.log(msg)}); // output build logs to terminal
b.on('update', bundle);

function bundle() {
    return b.bundle()
        .on('error', console.log)
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        //.pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        //.pipe(sourcemaps.write('./')) // writes .map file
        .pipe($.uglify())
        .pipe(gulp.dest(jsDest))
        //.pipe(browserSync.stream());
}


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
    gulp.watch(['./static/js/*.js'], ['es6']);
    gulp.watch(['./static/sass/**/*.scss'], ['sass']);
});
