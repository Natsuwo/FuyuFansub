const db = require('../db');
const axios = require('axios');
const moment = require('moment');


module.exports.index = (req, res) => {
    posts = db.get('posts').value();
    res.render('index', {
        posts,
        moment
    });
};

module.exports.view = (req, res) => {
    var postId = req.params.postId;
    var post = db.get('posts').find({ postId }).value();

    res.render('posts/view', {
        post: post
    });
};

module.exports.addPost = (req, res) => {
    var errors = [];
    res.render('posts/add-new', {
        errors,
        csrfToken: req.csrfToken()
    });
};

module.exports.addEpisode = (req, res) => {
    var errors = [];
    var posts = db.get('posts').value();
    res.render('episodes/add-new', {
        csrfToken: req.csrfToken(),
        errors,
        posts
    });
};

module.exports.postAddEpisode = (req, res) => {
    var date = Date.now();
    var postId = req.body.postId;
    var epNum = req.body.epNum;
    var link_download = req.body.link_download;

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
    
    const drive_url = 'https://drive.google.com/uc?id='+ get_id(link_download) +'&confirm=jYel&authuser=0&export=download';
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

        var fileName = result.fileName;
        var fileSize = formatBytes(result.sizeBytes);
        var count = 0;
        db.get('posts')
        .find({ postId })
        .get('episodes')
        .push({epNum, fileName, fileSize, date, link_download, count}).write();

        
        res.redirect('/');


    }).catch( (error) => {        
    });
};

module.exports.postAddPost = (req, res) => {
    req.body.thumbnail = req.file.path.split('\\').slice(1).join('/');
    req.body.episodes = [];

    db.get('posts').push(req.body).write();
    res.redirect('/');
};

module.exports.download = (req, res) => {
    var postId = req.params.postId;
    var epNum = req.params.epNum;

    var post = db.get('posts').find({ postId }).value();
    var episodes = post.episodes;
    episode = episodes.find(obj => obj.epNum === epNum);

    function get_id(url) {
        var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
        var match = url.match(regExp);
        return match[1];
    }

    var drive_url = 'https://drive.google.com/uc?id='+ get_id(episode.link_download) +'&confirm=jYel&authuser=0&export=download';
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

        db.get('posts')
        .find({ postId })
        .get('episodes')
        .find({ epNum })
        .update('count', n => n + 1)
        .write();

        res.render('posts/download', {
            post,
            epNum,
            result
        });      
    }).catch( (error) => {        
    });

};

module.exports.logout = (req, res) => {
    res.clearCookie('userId', { path: '/' });
    res.redirect('/');
};