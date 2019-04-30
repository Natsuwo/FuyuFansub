const Post = require('../models/post.model');
const Episode = require('../models/episode.model');
const axios = require('axios');

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
};

module.exports.view = async (req, res) => {
    var postId = req.params.postId;
    var post = await Post.findById({_id: postId});
    var episodes = await Episode.find({postId: postId});
    res.render('posts/view', {
        post,
        flash: {notice: req.flash('notice')},
        episodes
    });
};

module.exports.addPost = async (req, res) => {
    res.render('posts/add-new');
};

module.exports.addEpisode = async (req, res) => {
    var posts = await Post.find();
    
    res.render('episodes/add-new', {
        flash: {errors: req.flash('errors'), notice: req.flash('notice')},
        posts
    });
};

module.exports.postAddEpisode = async (req, res) => {
    var post = await Post.findOne({_id: req.body.postId});
    var date = Date.now();
    var {postId, epNum, link_download} = req.body;

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


        req.body.fileName = fileName;
        req.body.fileSize = fileSize;
        req.body.count = count;
        req.body.date = date;
        req.body.flag = post._status;

        await Episode.create(req.body);
        res.redirect('/');

    }).catch( (error) => {
        console.log(error);    
    });
};

module.exports.postAddPost = async (req, res) => {
    req.body.thumbnail = req.file.path.split('\\').slice(1).join('/');

    await Post.create(req.body);
    res.redirect('/');
};

module.exports.download = async (req, res) => {
    // var postId = req.params.postId;
    // var epNum = req.params.epNum;
    var episodeId = req.params.episodeId;

   // var post = db.get('posts').find({ postId }).value();
    // var post = await Post.find({ _id: postId });
    // var episodes = post[0].episodes;
    // episode = episodes.find(obj => obj.epNum === epNum);
    var episode = await Episode.findOne({_id: episodeId});

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

        await Episode.findOneAndUpdate({_id: episodeId}, { $inc: {'count': 1} }, { new: true});
        
        res.render('posts/download', {
            episode,
            result
        });      
    }).catch( (error) => {        
    });

};
// Edit Post
module.exports.edit = async (req, res) => {
   await Post.findById(req.params.postId, (err, post) => {
        res.render('posts/edit-post', {
            title: 'Edit Post',
            post
        });
    });
};

module.exports.postEdit = async (req, res) => {
    let post = {};
    post.post_title = req.body.post_title;
    post.tags = req.body.tags;
    post.studios = req.body.studios;
    post.description = req.body.description;
    post._status = req.body._status

    let query = {_id:req.params.postId};

    await Episode.find({postId: req.params.postId}).updateMany({}, {"$set":{"flag": post._status}});

    await Post.updateOne(query, post, (err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
};
// Delete Post
module.exports.delete = async (req, res) => {
    let query = {_id: req.params.postId};

    await Post.remove(query, (err) => {
        if(err) {
            console.log(err);
        }
    });

    await Episode.find({postId: req.params.postId}).remove({postId: req.params.postId}, (err) => {
        if(err) {
            console.log(err);
        }
    });

    res.redirect('/');
};
// Delete Episode

module.exports.deleteEpisode = async (req, res) => {
    let query = {_id: req.params.epId};

    await Episode.remove(query, (err) => {
        if(err) {
            console.log(err);
        }
    });

    res.redirect('back');
};

// Logout
module.exports.logout = (req, res) => {
    res.clearCookie('userId', { path: '/' });
    res.redirect('/');
};