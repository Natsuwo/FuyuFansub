const Post = require('../models/post.model');
const axios = require('axios');
const moment = require('moment');


module.exports.index = async (req, res) => {
    var posts = await Post.find();

    res.render('index', {
        posts,
        moment
    });
};

module.exports.project = (req, res) => {
    var page = req.query.page || 1;
    var perPage = 15;

    var skip = (page * perPage) - perPage;
    var limit = perPage; 

    Post
        .find({})
        .skip(skip)
        .limit(limit)
        .exec(function(err, posts) {
            Post.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('posts/list-project', {
                    posts,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        });

    // var posts = await Post.find().limit(perPage).skip(perPage * page);
    // res.render('posts/list-project', {
    //     posts,
    //     moment
    // });
};

module.exports.view = async (req, res) => {
    var postId = req.params.postId;
    var post = await Post.findById({_id: postId});
    res.render('posts/view', {
        post: post
    });
};

module.exports.addPost = async (req, res) => {
    var errors = [];
    res.render('posts/add-new', {
        csrfToken: req.csrfToken(),
        errors
    });
};

module.exports.addEpisode = async (req, res) => {
    var errors = [];
    var posts = await Post.find();
    res.render('episodes/add-new', {
        csrfToken: req.csrfToken(),
        errors,
        posts
    });
};

module.exports.postAddEpisode = async (req, res) => {
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
    .then( async (response) => {
        var str = response.data;
        var result = str.replace(')]}\'\n', '');
        result = JSON.parse(result);

        var fileName = result.fileName;
        var fileSize = formatBytes(result.sizeBytes);
        var count = 0;
        // db.get('posts')
        // .find({ postId })
        // .get('episodes')
        // .push({epNum, fileName, fileSize, date, link_download, count}).write();
        await Post.findOneAndUpdate({_id: postId}, {$push: {episodes:[{epNum, fileName, fileSize, date, link_download, count}]}}, {new: true});
        res.redirect('/');

    }).catch( (error) => {
        console.log(error);    
    });
};

module.exports.postAddPost = async (req, res) => {
    req.body.thumbnail = req.file.path.split('\\').slice(1).join('/');
    req.body.episodes = [];

   // db.get('posts').push(req.body).write();
    await Post.create(req.body);
    console.log(req.body);
    res.redirect('/');
};

module.exports.download = async (req, res) => {
    var postId = req.params.postId;
    var epNum = req.params.epNum;

   // var post = db.get('posts').find({ postId }).value();
    var post = await Post.find({ _id: postId });
    var episodes = post[0].episodes;
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
    .then( async (response) => {
        var str = response.data;
        var result = str.replace(')]}\'\n', '');
        result = JSON.parse(result);

        // db.get('posts')
        // .find({ postId })
        // .get('episodes')
        // .find({ epNum })
        // .update('count', n => n + 1)
        // .write();
        //var updateCount = await Post.episodes.find({_id: postId}).lean();
        //findOneAndUpdate({_id: id, “subPosts.subNum”: subNum}, { $inc: {“subPosts.$.count”: 1} }, { new: true})
        await Post.findOneAndUpdate({_id: postId, 'episodes.epNum': epNum}, { $inc: {'episodes.$.count': 1} }, { new: true});
        

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