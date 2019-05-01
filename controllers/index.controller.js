const Post = require('../models/post.model');
const Episode = require('../models/episode.model');
const moment = require('moment');

module.exports.index = async (req, res) => {
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    var page = req.query.page || 1;
    var perPage = 30;

    var skip = (page * perPage) - perPage;
    var limit = perPage;

    var sort = {date: -1};
    dateSort = {'dateUrl': `/?s=date&o=asc`, 'class': 'sorting'};
    sizeSort = {'sizeUrl': '/?s=size&o=desc', 'class': 'sorting'};
    countSort = {'countUrl': '/?s=count&o=desc', 'class': 'sorting'};

    if(Object.keys(req.query).length > 0) {
        var q = req.query.q,
            s = req.query.s,
            o = req.query.o,
            f = req.query.f;
        if(!req.query.q){q = ''}
        const regex = new RegExp(escapeRegex(q), 'gi');
        var search = {fileName: regex};

        var resultF = '';
        if(f == '1'){
            resultF = ' in Filter Ongoing.';
        } if(f == '2'){
            resultF = ' in Filter Completed.';
        } if(f == '3'){
            resultF = ' in Filter Droped.';
        }

        if(s == 'date' && o == 'desc') {
            sort = {date: -1};
            dateSort = {'dateUrl': '/?s=date&o=asc', 'class': 'sorting_desc'};
        }

        if(s == 'date' && o == 'asc') {
            sort = {date: 1};
            dateSort = {'dateUrl': '/?s=date&o=desc', 'class': 'sorting_asc'};
        }

        if(s == 'size' && o == 'desc') {
            sort = {fileSize: -1};
            sizeSort = {'sizeUrl': '/?s=size&o=asc', 'class': 'sorting_desc'};
        }

        if(s == 'size' && o == 'asc') {
            sort = {fileSize: 1};
            sizeSort = {'sizeUrl': '/?s=size&o=desc', 'class': 'sorting_asc'};
        }

        if(s == 'count' && o == 'desc') {
            sort = {count: -1};
            countSort = {'countUrl': '/?s=count&o=asc', 'class': 'sorting_desc'};
        }

        if(s == 'count' && o == 'asc') {
            sort = {count: 1};
            countSort = {'countUrl': '/?s=count&o=desc', 'class': 'sorting_asc'};
        }

        
        if(parseInt(f) > 0) {
            search = {fileName: regex, flag: req.query.f};
        }


        // Get all campgrounds from DB
        Episode.find(search).skip(skip)
        .limit(limit)
        .sort(sort)
        .exec(function(err, episodes) {
            Episode.count().exec(function(err, count) {
                if (err) return next(err)
                else {
                    if(episodes.length < 1) {
                        req.flash('primary', 'Not found!');
                    }if(episodes.length > 1 && q) {
                        req.flash('primary', 'Result for ' + q);
                    }if(episodes.length > 1 && parseInt(f) > 0){
                        req.flash('primary', 'Result' + resultF);
                    }

                    res.render("index", {
                        flash: {notice: req.flash('notice'), primary: req.flash('primary')},
                        episodes,
                        sizeSort,
                        dateSort,
                        countSort,
                        moment,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    });
                    }
            })
        });
    } else{
        Episode
        .find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(function(err, episodes) {
            Episode.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('index', {
                    flash: {notice: req.flash('notice')},
                    episodes,
                    dateSort,
                    sizeSort,
                    countSort,
                    moment,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        });
    }
};

module.exports.about = (req, res) => {
    res.render('about-us', {
        title: 'About Us'
    });
};