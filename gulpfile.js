let project_folder = "dist";
let source_folder = "#src";

let fs = require('fs');
const { rename } = require('fs/promises');

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest, registry } = require('gulp'),
    gulp = require('gulp'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2');
    browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));


function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude({
         prefix: '@@',
         basepath: '@file'
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function buildStyles() {
    return gulp.src(path.src.css)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(path.build.css))
      .pipe(browsersync.stream());
      
}

  function images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        // .pipe(
        //     rename({
        //         extname: ".min.js"
        //     })
        // )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

function fontsStyle(params) {
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() { }

function watch() {
    gulp.watch(path.watch.css, gulp.series(buildStyles));
    gulp.watch(path.watch.html, gulp.series(html));
    gulp.watch(path.watch.js, gulp.series(js));
}
  

let build = gulp.series(html, images, fonts, buildStyles, js, fontsStyle);
let watchTask = gulp.parallel(build, browserSync, watch);



exports.html = html;
exports.build = build;
exports.watch = watchTask;
exports.default = watchTask;
exports.buildStyles = buildStyles;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
// exports.js = js;



