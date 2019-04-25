const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');
const md5 = require('md5');

router.get('/', (req, res) => {
    posts = db.get('posts').value();  
    res.render('index', {
        posts: posts
    });
});

router.get('/view/:id', (req, res) => {
    var id = req.params.id;
    var post = db.get('posts').find({ id: id }).value();

    res.render('posts/view', {
        post: post
    });
});

router.get('/upload', (req, res) => {
    res.render('posts/upload');
});

router.post('/upload', (req, res) => {
    var today = new Date();
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    mintues = checkZero(minutes);
    seconds = checkZero(seconds);


    function checkZero(data){
    if(data < 10){
        data = "0" + data;
    }
    return data;
    }

    function get_id(url){
        var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
        var match = url.match(regExp);
        return match[1];
    }

    function formatBytes(bytes,decimals) {
        if(bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    const drive_url = 'https://drive.google.com/uc?id='+ get_id('https://drive.google.com/open?id=12MCznNP_Nt5LJOMo8_BjKmxE5rgEETck') +'&confirm=jYel&authuser=0&export=download';
    axios.post(drive_url, this.data, {
        headers: { 
            'Accept': '*/*',
            'Accept-encoding': 'gzip, deflate, br',
            'Accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Content-length': '0',
            'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Origin': 'https://drive.google.com',
            'Referer': 'https://drive.google.com/drive/my-drive',
            'User-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'X-chrome-connected': 'id=102224796319835333482,mode=0,enable_account_consistency=false',
            'X-client-data': 'CIa2yQEIpbbJAQipncoBCKijygEYkqPKAQ==',
            'X-drive-first-party': 'DriveWebUi',
            'X-json-requested': 'true'
        }
    })
    .then( (response) => {
        var str = response.data;
        var result = str.replace(')]}\'\n', '');
        result = JSON.parse(result);
        
        req.body.date = year + "-" + month + "-" + day + " " + hour + ":" + minutes;
        req.body.id = md5(req.body.post_title);
        req.body.link_hash = md5(req.body.link_download);
        req.body.file_size = formatBytes(result.sizeBytes);
        db.get('posts').push(req.body).write();
        res.redirect('/');
    }).catch( (error) => {        
    });
});

module.exports = router;