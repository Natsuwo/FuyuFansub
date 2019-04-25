const md5 = require('md5');

module.exports.postUpload = (req, res, next) => {
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

        
    req.body.date = year + "-" + month + "-" + day + " " + hour + ":" + minutes;
    req.body.id = md5(req.body.post_title);

    const errors = [];

    if (!req.body.post_title) {
        errors.push('Post name is required');
    }

    if (errors.length) {
        res.render('posts/upload', {
            errors: errors
        });
        return;
    }

    next();
};