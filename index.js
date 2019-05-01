require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const axios = require('axios');

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


const port = process.env.PORT || 3000;


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

app.use(csrf());

app.use(function(req, res, next) {
	res.locals.csrf_token = req.csrfToken();
	next();
});



app.use(flash());
app.use( async (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');

    var commitApi = await axios.get('https://api.github.com/repos/Natsuwo/FuyuFansub/git/refs/heads/');
    res.locals.commit = commitApi.data[0].object['sha'].slice(0, 8);
    next();
});

app.use('/', indexRoute);
app.use('/', postRoute);
app.use('/', episodeRoute);
app.use('/', userRoute);
app.use('/', authRoute);

app.use('/api/posts', authMiddleware.requireAuth, apiPostRoute);
// End App Config

app.use((err, req, res, next) => {
    if (err) {
      return res.status(403).send(err.message);
    }
    next();
  });
  
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});