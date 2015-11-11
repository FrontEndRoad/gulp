/**
 * 组件安装
 * npm install gulp-imagemin gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-autoprefixer gulp-notify gulp-cache imagemin-pngquant gulp-tinypng gulp-minify-html --save-dev
 */

/**
* -----------说明
* gulp build      文件打包
* gulp watch      文件监听
* gulp help       gulp参数说明
* gulp server     测试server
* gulp -p         生产环境（默认生产环境）
* gulp -d         开发环境
* gulp -m <module>         部分模块打包(默认全部打包)
*/


// 引入 gulp及组件
var gulp       = require('gulp'),                 //基础库
    imagemin   = require('gulp-imagemin'),        //图片压缩
    minifycss  = require('gulp-minify-css'),       //css压缩
    jshint     = require('gulp-jshint'),           //js检查
    uglify     = require('gulp-uglify'),           //js压缩
    rename     = require('gulp-rename'),           //重命名
    concat     = require('gulp-concat'),           //合并JS文件
    clean      = require('gulp-clean'),            //清空文件夹
    autoprefixer = require("gulp-autoprefixer"),   //自动添加前缀
    notify       = require('gulp-notify'),         //更新信息
    cache        = require('gulp-cache'),          //图片快取，只有更改过得图片会进行压缩
    pngquant     = require('imagemin-pngquant'),   //png24位转压png8
    tinypng      = require('gulp-tinypng'),        //执行tinypng压缩
    minifyHtml   = require('gulp-minify-html');        //压缩html
var tinypngapi = "8FiQFj9oWwEyTBHMMwxjvuYNx05Fphk2";


/*----------------------------------------------------------------------------配置任务*/
// HTML处理
gulp.task('html', function() {
    var htmlSrc = '*.html',
        htmlDst = 'dist/';

    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        //给文件添加.min后缀
        .pipe(rename({ suffix: '.min' }))
        //压缩html
        .pipe(minifyHtmli())
        //输出压缩文件到指定目录
        .pipe(gulp.dest(htmlDst))
        //提醒任务完成
        //.pipe(notify({ message: 'html task complete' }));
});


// 样式处理 
gulp.task('css', function() {
    var cssSrc = 'css/*.css',
        cssDst = 'dist/css';

    return gulp.src(cssSrc)
        .pipe(gulp.dest(cssDst))
        //给文件添加.min后缀
        .pipe(rename({ suffix: '.min' }))
        //压缩css
        .pipe(minifycss())
        //输出压缩文件到指定目录
        .pipe(gulp.dest(cssDst))
        //提醒任务完成
        //.pipe(notify({ message: 'css task complete' }));
});


// js处理
gulp.task('js', function () {
    var jsSrc = 'js/**/*.js',
        jsDst ='dist/js';

    //js代码校验
    return gulp.src(jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //js代码合并
        .pipe(concat('all.js'))
        .pipe(gulp.dest(jsDst))
        //给文件添加.min后缀
        .pipe(rename({ suffix: '.min' }))
        //压缩脚本文件
        .pipe(uglify())
        //输出压缩文件到指定目录
        .pipe(gulp.dest(jsDst))
        //提醒任务完成
        //.pipe(notify({ message: 'Scripts task complete' }));

});


// 图片处理
gulp.task('images', function(){
    var imgSrc = 'images/**/*',
        imgDst = 'dist/images';

    return gulp.src(imgSrc)
        .pipe(cache(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant({quality: '65-80'})]     //把png24压缩成png8，提及一般可以减少50%以上
        })))
        .pipe(gulp.dest(imgDst))
        //.pipe(notify({ message: 'Images task complete' }));
})


//压缩图片 - tinypng
gulp.task('tinypng', function() {
    var tinySrc = 'images/**/*',
        tinyDst = 'dist/images';

    gulp.src(tinySrc)
        .pipe(tinypng(tinypngapi))
        .pipe(gulp.dest(tinyDst));
});


// 清空默认页面、样式、图片、JS
gulp.task('clean', function() {
    return gulp.src(['dist/*.html', 'dist/css', 'dist/js', 'dist/images'], {read: false})  //不想要读取已经被删除的档案，加入read: false选项来防止gulp读取档案内容–让它快一些
        .pipe(clean())
});


// 清空多余文件
gulp.task('excess', function() {
    return gulp.src(['.gulp', '.sass-cache'])  //不想要读取已经被删除的档案，加入read: false选项来防止gulp读取档案内容–让它快一些
        .pipe(clean({ force: true }))
        .pipe(gulp.dest('excess'));
});



// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){
    // 监听html
    gulp.watch('*.html', ['html'])
    
    // 监听css
    gulp.watch('css/**/*.css', ['css'])

    // 监听js
    gulp.watch('js/**/*.js', ['js'])

    // 监听images
    gulp.watch('images/**/*', ['images'])

});


// 输出帮助信息
gulp.task('help',function () {
    console.log('   gulp build          文件打包');
    console.log('   gulp watch          文件监控打包');
    console.log('   gulp help           gulp参数说明');
    console.log('   gulp server         测试server');
    console.log('   gulp -p             生产环境（默认生产环境）');
    console.log('   gulp -d             开发环境');
    console.log('   gulp -m <module>        部分模块打包（默认全部打包）');
});



// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){     //clean任务执行完后
    gulp.start('html','css','js','images', 'tinypng', 'excess');
});


