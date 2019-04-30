require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const request = require('request');
const session = require('express-session');

mongoose.connect(process.env.MONGO_URL);

const indexRoute = require('./routes/index.route');
const postRoute = require('./routes/post.route');
const episodeRoute = require('./routes/episode.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

const apiPostRoute = require('./api/routes/post.route');

const checkLoginMiddleware = require('./middlewares/checkLogin.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');
const authMiddleware = require('./middlewares/auth.middleware');
const captchaValidate = require('./validate/captcha.validate');


const port = 3000;


// const Posts = require('./models/user.model');
// config EJS
app.set('view engine', 'ejs');
app.set('views', './views');
// end config 

// App Config 
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: '_session',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(sessionMiddleware);
app.use(checkLoginMiddleware.checkLogin);



app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});

app.use('/', indexRoute);
app.use('/', postRoute);
app.use('/', episodeRoute);
app.use('/', userRoute);
app.use('/', authRoute);

app.use('/api/posts', authMiddleware.requireAuth, apiPostRoute);

app.post('/captcha', (req, res) => {
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
      ){
        return res.json({"success": false, "msg":"Please select captcha"});
      }
    
      // Secret Key
      const secretKey = '6LcLSBETAAAAAHKKptZbdAENAwUfW0W2lHerNKNk';
    
      // Verify URL
      const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
    
      // Make Request To VerifyURL
      request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
        console.log(body);
    
        // If Not Successful
        if(body.success !== undefined && !body.success){
          return res.json({"success": false, "msg":"Failed captcha verification"});
        }
    
        //If Successful
        return res.json({"success": true, "msg":"Captcha passed"});
      });
    });

app.get('/test', (req, res) => {
    res.render('test');
})
// End App Config

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});