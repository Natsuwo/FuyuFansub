require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const csrfMiddleware = csurf({
    cookie: true
  });

mongoose.connect(process.env.MONGO_URL);

const postRoute = require('./routes/post.route');
const episodeRoute = require('./routes/episode.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

const apiPostRoute = require('./api/routes/post.route');

const checkLoginMiddleware = require('./middlewares/checkLogin.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');
const authMiddleware = require('./middlewares/auth.middleware');
const Post = require('./models/post.model');

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
app.use(csrfMiddleware);
app.use(sessionMiddleware);
app.use(checkLoginMiddleware.checkLogin);

app.use('/', postRoute);
app.use('/', episodeRoute);
app.use('/', userRoute);
app.use('/', authRoute);

app.use('/api/posts', authMiddleware.requireAuth, apiPostRoute);

app.get('/test', async function(req, res){

	//set default variables
	var totalStudents = 80,
		pageSize = 8,
		pageCount = 80/8,
		currentPage = 1,
		students = [],
		studentsArrays = [], 
		studentsList = [];

	//genreate list of students
	for (var i = 1; i < totalStudents; i++) {
		students.push({name: 'Student Number ' + i});
	}

	//split list into groups
	while (students.length > 0) {
	    studentsArrays.push(students.splice(0, pageSize));
	}

	//set current page if specifed as get variable (eg: /?page=2)
	if (typeof req.query.page !== 'undefined') {
		currentPage = +req.query.page;
	}

	//show list of students from group
	studentsList = studentsArrays[+currentPage - 1];

	//render index.ejs view file
	res.render('test', {
		students: studentsList,
		pageSize: pageSize,
		totalStudents: totalStudents,
		pageCount: pageCount,
		currentPage: currentPage
	});
});
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