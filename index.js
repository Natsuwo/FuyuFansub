require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
var session = require('express-session');

mongoose.connect(process.env.MONGO_URL);

const postRoute = require('./routes/post.route');
const episodeRoute = require('./routes/episode.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

const apiPostRoute = require('./api/routes/post.route');

const checkLoginMiddleware = require('./middlewares/checkLogin.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');
const authMiddleware = require('./middlewares/auth.middleware');


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



app.use(csrf());

app.use(function(req, res, next) {
	res.locals.csrf_token = req.csrfToken();
	next();
});

app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});


app.use('/', postRoute);
app.use('/', episodeRoute);
app.use('/', userRoute);
app.use('/', authRoute);

app.use('/api/posts', authMiddleware.requireAuth, apiPostRoute);
// End App Config


// app.get('/', (req, res) => {
//     const q = req.query.q;
//     const matchedPosts = db.get('posts').value().filter(function(post) {
//         return post.post_title.indexOf(q) !== -1;
//     });

//     res.render('index', {
//         posts: matchedPosts
//     });
// });

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});