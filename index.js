'use strict';

const http = require('http'),
    https = require('https'),
    fs = require('fs'), // 用于读写文件
    path = require('path'),
    cheerio = require('cheerio');

const saveData = require('./utils/saveData');
const downloadImg = require('./utils/downloadImg');

const opt = {
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 80
}


const spider = (index) => {
    return new Promise((reslove, reject) => {
        https.get(`https://movie.douban.com/top250?start=${index}`, (res) => {
            var html = ''; // 保存抓取到的HTML源码
            var movies = []; // 保存解析HTML后的数据，即我们需要的电影信息
            res.setEncoding('utf-8'); // 设置编码
            res.on('data', function (chunk) {
                html += chunk; // 抓取页面内容
            });
            res.on('end', function () {
                // 使用 cheerio 加载抓取到的HTML代码
                // 然后就可以使用 jQuery 的方法了
                // 比如获取某个class：$('.className')
                // 这样就能获取所有这个class包含的内容
                var $ = cheerio.load(html);
                // 解析页面
                // 每个电影都在 item class 中
                $('.item').each(function () {
                    // 获取图片链接
                    var picUrl = $('.pic img', this).attr('src');
                    // 获取排名作为id
                    let id = parseInt($('.pic em', this).text(), 10);
                    var movie = {
                        title: $('.title', this).text(), // 获取电影名称
                        star: $('.info .star .rating_num', this).text(), // 获取电影评分
                        link: $('a', this).attr('href'), // 获取电影详情页链接
                        picUrl: picUrl,
                        id
                    };
                    // 把所有电影放在一个数组里面
                    if (movie) {
                        movies.push(movie);
                    }
                    // 调用下载图片方法
                    // downloadImg('../img/', movie.picUrl);
                });

                reslove(movies);
                // 保存抓取到的电影数据
                // saveData('./data' + (index / pageSize) + '.json', movies);
            });

        })
    })
    // return https.get(`https://movie.douban.com/top250?start=${index}`);
}

const doSpider = async() => {
    try {
        // let res = await gg(0);
        let pageSize = 25;
        let pages = Math.ceil(250 / pageSize);
        let movies = [];
        for (let i = 0; i < pages; i++) {
            let result = await spider(i * 25);
            movies = [...movies, ...result];
        }
        saveData('./data.json', movies);
        // movies.map(movie => downloadImg('../img/', movie.picUrl));
    } catch (error) {
        console.log(error);
    }
}

doSpider();