require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const postRoute = require('./routes/post.route');
const episodeRoute = require('./routes/episode.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

const checkLoginMiddleware = require('./middlewares/checkLogin.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');

const port = 3000;

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/fuyu-db');

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
app.use(sessionMiddleware);
app.use(csurf({ cookie: true }));
app.use(checkLoginMiddleware.checkLogin);

app.use('/', postRoute);
app.use('/', episodeRoute);
app.use('/', userRoute);
app.use('/', authRoute);
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