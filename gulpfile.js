const { src, dest, series, watch } = require("gulp");
// const sass = require('gulp-sass')(require('sass'))
const csso = require("gulp-csso");
// const concat = require('gulp-concat')
const autoprefixer = require("gulp-autoprefixer");
// const include = require('gulp-file-include')
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
// const svgsprite = require('gulp-svg-sprite')
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const gulpBabel = require("gulp-babel");
const gulpUglify = require("gulp-uglify");
const clean = require("gulp-clean");
const sync = require("browser-sync").create();
// import imagemin from 'gulp-imagemin';
const removeComments = require("gulp-strip-css-comments");
function html() {
  return (
    src("./**.html")
      // .pipe(include({
      //     prefix: '@@'
      // }))

      // .pipe(webphtml())
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
      .pipe(dest("dist"))
      .pipe(sync.reload({ stream: true }))
  );
}

function css() {
  return (
    src("src/assets/css/**.css")
      // .pipe(sass())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
        })
      )
      .pipe(csso())
      // .pipe(concat('index.css'))
      .pipe(removeComments())
      .pipe(dest("dist/assets/css"))
      .pipe(sync.reload({ stream: true }))
  );
}

function js() {
  return (
    src("src/assets/js/*.js")
      .pipe(gulpBabel())
      .pipe(gulpUglify())
      // .pipe(concat('index.js'))
      .pipe(dest("dist/assets/js"))
  );
}

function del() {
  return src("dist").pipe(clean());
}

function images() {
  return (
    src(
      "src/assets/**/*.{jpg,png,jpeg,webp,gif}"
      // '!src/images/icon/*'
    )
      // .pipe(
      //     webp ({
      //         quality: 70
      //     })
      // )
      // .pipe(dest('dist/images'))

      // .pipe(src('src/images/**/*.{jpg,png,jpeg,svg,gif}'
      // ))

      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, //0 to7
        })
      )
      .pipe(dest("dist/assets"))
  );
}

function media() {
  return src("src/assets/media/**").pipe(dest("dist/assets/media"));
}

function font() {
  return src("src/assets/fonts/**").pipe(dest("dist/assets/fonts"));
}

function serve() {
  sync.init({
    server: "./dist",
  });
  watch("src/**/**.html", series(html)).on("change", sync.reload);
  watch("src/assets/css/**.css", series(css)).on("change", sync.reload);
  // watch('src/js/**.js', series(js)).on('change', sync.reload)
}
exports.build = series(del, images, media, font, js, css, html);
exports.serve = series(del, images, media, font, js, css, html, serve);
// exports.clear = del
