const md5 = require('md5');
const db = require('../db');

module.exports.postLogin = (req, res, next) => {  
    const errors = [];
    const {email, password}  = req.body;
    const user = db.get('users').find({ email: email }).value();
 
    if (!user) {
      errors.push('User desn\'t exist.');
    }

    const hashedPassword = md5(password);
    if (
        typeof user !== "object" || (  
        typeof password == "undefined" ||
        hashedPassword !== user.password
        )
        ){
     errors.push('Wrong password');
    }
    
    if (errors.length) {
     res.render('auth/login', {
         errors,
         values: req.body
     });
     return;
    }

    res.cookie('userId', user.id, {
        signed: true
    });
    next();

}
