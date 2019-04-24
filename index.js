const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

const postRoute = require('./routes/post.route');

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


app.use('/', postRoute);
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