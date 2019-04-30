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

    if(Object.keys(req.query).length > 0) {
        q = req.query.q;
        if(!req.query.q){q = ''}
        const regex = new RegExp(escapeRegex(q), 'gi');
        var search = {fileName: regex};

        var resultF;
        if(req.query.f == '1'){
            resultF = 'Filter Ongoing.';
        } if(req.query.f == '2'){
            resultF = 'Filter Completed.';
        } if(req.query.f == '3'){
            resultF = 'Filter Droped.';
        }
        
        if(parseInt(req.query.f) > 0) {
            search = {fileName: regex, flag: req.query.f};
        }

        // Get all campgrounds from DB
        Episode.find(search).skip(skip)
        .limit(limit)
        .exec(function(err, episodes) {
            Episode.count().exec(function(err, count) {
                if (err) return next(err)
                else {
                    if(episodes.length < 1) {
                        req.flash('primary', 'Not found!');
                    }else {
                        req.flash('primary', 'Result for ' + q + resultF);
                    }        

                    res.render("index", {
                        flash: {notice: req.flash('notice'), primary: req.flash('primary')},
                        episodes,
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
        .skip(skip)
        .limit(limit)
        .exec(function(err, episodes) {
            Episode.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('index', {
                    flash: {notice: req.flash('notice')},
                    episodes,
                    moment,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        });
    }
};
