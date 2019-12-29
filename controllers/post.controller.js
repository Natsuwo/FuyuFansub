const Post = require('../models/post.model');
const Episode = require('../models/episode.model');
const axios = require('axios');
const cloudinary = require('cloudinary');

module.exports.project = (req, res) => {
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    var page = req.query.page || 1;
    var perPage = 15;

    var skip = (page * perPage) - perPage;
    var limit = perPage;

    if (Object.keys(req.query).length > 0) {
        var q = req.query.q;
        if (!req.query.q) { q = '' }
        const regex = new RegExp(escapeRegex(q), 'gi');
        var search = { post_title: regex };

        Post
            .find(search)
            .sort({ post_title: 1 })
            .skip(skip)
            .limit(limit)
            .exec(function (err, posts) {
                Post.count(search).exec(function (err, count) {
                    if (err) return next(err)
                    res.render('posts/list-project', {
                        posts,
                        action: '/list-project',
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            });
    } else {
        Post
            .find({})
            .sort({ post_title: 1 })
            .skip(skip)
            .limit(limit)
            .exec(function (err, posts) {
                Post.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('posts/list-project', {
                        posts,
                        action: '/list-project',
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            });
    }
};

module.exports.view = async (req, res) => {
    var postId = req.params.postId;
    var post = await Post.findById({ _id: postId });
    var episodes = await Episode.find({ postId: postId });
    res.render('posts/view', {
        post,
        flash: { notice: req.flash('notice') },
        episodes
    });
};

module.exports.addPost = async (req, res) => {
    res.render('posts/add-new');
};
// Add Ep
module.exports.addEpisode = async (req, res) => {
    var posts = await Post.find().sort({ post_title: 1 });

    res.render('episodes/add-new', {
        flash: { errors: req.flash('errors'), notice: req.flash('notice') },
        posts
    });
};

module.exports.postAddEpisode = async (req, res) => {
    var post = await Post.findOne({ _id: req.body.postId });
    var date = Date.now();
    var { postId, epNum, link_download } = req.body;

    function get_id(url) {
        var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
        var match = url.match(regExp);
        return match[1];
    }
    var drive_id = get_id(link_download)
    const drive_url = 'https://www.googleapis.com/drive/v2/files/' + drive_id + '?key=' + process.env.GOOGLE_API_KEY + '&supportsTeamDrives=true'
    axios.get(drive_url)
        .then(async (response) => {
            var result = response.data
            var fileName = result.originalFilename;
            var fileSize = result.fileSize;
            var count = 0;


            req.body.fileName = fileName;
            req.body.fileSize = fileSize;
            req.body.count = count;
            req.body.date = date;
            req.body.flag = post._status;

            await Episode.create(req.body);

        }).catch((error) => {
            console.log(error);
        });
};
// Add Multi Ep
module.exports.addMultiEp = async (req, res) => {
    var posts = await Post.find().sort({ post_title: 1 });

    res.render('episodes/add-multi', {
        flash: { errors: req.flash('errors'), notice: req.flash('notice') },
        posts
    });
};

module.exports.postAddMultiEp = async (req, res) => {
    var post = await Post.findOne({ _id: req.body.postId });
    var date = Date.now();

    function get_id(url) {
        var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
        var match = url.match(regExp);
        return match[1];
    }

    const drive_url = 'https://www.googleapis.com/drive/v2/files?q=%27' + get_id(req.body.link_download) + `%27%20in%20parents&maxResults=9999&orderBy=title_natural&key=${process.env.GOOGLE_API_KEY}&fields=items(title,id,mimeType,fileSize)`;
    var folderList = await axios.get(drive_url);
    var results = folderList.data.items;
    let lists = {};
    for (let result of results) {
        if (result.mimeType == "video/x-matroska" ||
            result.mimeType == "video/mp4" ||
            result.mimeType == "application/rar" ||
            result.mimeType == "application/octet-stream") {
            lists.postId = req.body.postId;
            lists.epNum = "";
            lists.fileName = result.title;
            lists.fileSize = result.fileSize;
            lists.date = date;
            lists.flag = post._status;
            lists.link_download = 'https://drive.google.com/open?id=' + result.id;
            lists.count = 0;

            await Episode.create(lists);
        }
    }
};
// 

module.exports.postAddPost = async (req, res) => {
    //req.body.thumbnail = req.file.path.split('\\').slice(1).join('/');
    cloudinary.uploader.upload(req.file.path, async (result) => {
        req.body.thumbnail = result.secure_url;

        await Post.create(req.body);
        res.redirect('/');
    });



};

module.exports.download = async (req, res) => {
    var episodeId = req.params.episodeId;
    var episode = await Episode.findOne({ _id: episodeId });

    function get_id(url) {
        var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
        var match = url.match(regExp);
        return match[1];
    }

    var drive_url = 'https://drive.google.com/uc?id=' + get_id(episode.link_download) + '&confirm=jYel&authuser=0&export=download';
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
        .then(async (response) => {
            var str = response.data;
            var result = str.replace(')]}\'\n', '');
            result = JSON.parse(result);

            await Episode.findOneAndUpdate({ _id: episodeId }, { $inc: { 'count': 1 } }, { new: true });
            res.redirect("https://loptelink.pro/st?api=f07d734039e961018a335683d377c226e92daa3b&url=" + episode.link_download);
        }).catch((error) => {
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
    post.thumbnail = req.body.thumbnail;
    post.post_title = req.body.post_title;
    post.tags = req.body.tags;
    post.studios = req.body.studios;
    post.description = req.body.description;
    post._status = req.body._status

    let query = { _id: req.params.postId };

    await Episode.find({ postId: req.params.postId }).updateMany({}, { "$set": { "flag": post._status } });

    await Post.updateOne(query, post, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/view/' + req.params.postId);
        }
    });
};
// Delete Post
module.exports.delete = async (req, res) => {
    let query = { _id: req.params.postId };

    await Post.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
    });

    await Episode.find({ postId: req.params.postId }).remove({ postId: req.params.postId }, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/');
};
// Delete Episode

module.exports.deleteEpisode = async (req, res) => {
    let query = { _id: req.params.epId };

    await Episode.remove(query, (err) => {
        if (err) {
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