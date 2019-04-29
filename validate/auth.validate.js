const md5 = require('md5');
const User = require('../models/user.model');

module.exports.postLogin = async (req, res, next) => {  
    var errors = [];
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    var users = await User.find();
    var user = users.find(x => x.email === email);

    if(!user) {
      user = users.find(x => x.username === email);
      if(!user) {
        errors.push('User or Email desn\'t exist.');
      }
    }

    var hashedPassword = md5(password);

    if (
      typeof user !== "object" || (  
      typeof password == "undefined" ||
      hashedPassword !== user.password
      ) ){
      errors.push('Wrong password');
    }
    
    if (errors.length) {
     res.render('auth/login', {
         errors
     });
     return;
    }

    res.cookie('userId', user.id, {
        signed: true
    });

    next();

}
