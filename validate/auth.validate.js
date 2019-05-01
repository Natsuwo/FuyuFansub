const md5 = require('md5');
const request = require('request');
const User = require('../models/user.model');

module.exports.postLogin = async (req, res, next) => {  
    var errors = [];
    var email = req.body.email;
    var password = req.body.password;
    var captcha = req.body['g-recaptcha-response'];
    

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
      errors.push('Wrong password.');
    }

    if(!captcha) {
      errors.push('Please select captcha.');
    }

    if (errors.length) {
      res.render('auth/login', {
          flash: {errors: req.flash('errors')},
          errors
      });
      return;
     }
  
    // Secret Key
    const secretKey = '6LcLSBETAAAAAHKKptZbdAENAwUfW0W2lHerNKNk';
  
    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
    
    // Make Request To VerifyURL
    request(verifyUrl, (err, response, body) => {
      body = JSON.parse(body);
  
      // If Not Successful
      if(body.success == false){
        req.flash('errors', 'Failed captcha verification.');
        res.render('auth/login', {
          flash: {errors: req.flash('errors')}
        });
        return;
      }

      res.cookie('userId', user.id, {
        signed: true
      });

      next();

    });



}
