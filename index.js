var express = require('express');
var app = express();
var port = 3000;

// config EJS
app.set('view engine', 'ejs');
app.set('views', './views');
// end config 

// App Config 
app.use(express.static('public'));

// End App Config

users = [
 { id: 1, name: 'Natsu' },
 { id: 2, name: 'Henxuj15' }
];

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/Abouts', (req, res) => {
    res.render('users/index', {
        users: users
    });
});

app.get('/Abouts/search', (req, res) => {
    const q = req.query.q;
    const matchedUsers = users.filter(function(user) {
        return user.name.indexOf(q) !== -1;
    });

    res.render('users/index', {
        users: matchedUsers
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});