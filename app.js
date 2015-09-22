var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var session = require('client-sessions');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	cookieName: 'session',
	secret: 'random_string',
	duration: 30 * 60 * 1000
}));

mongoose.connect('mongodb://localhost:27017/sss');

var data = new Schema({
	id: ObjectId,
	firstname: String,
	lastname: String, 
	email: { type: String, unique: true},
	password: String
});

var User = mongoose.model('User', data);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/login', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/register', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/register.html'));
});

app.get('/dashboard', function (req, res) {
	if(req.session && req.session.user) {
		User.findOne({ emil: req.session.user.email }, function (err, user) {
			if(!user) {
				req.session.reset();
				res.redirect('/login');
			} else {
				// res.locals.user = user;
				res.sendFile(path.join(__dirname + '/views/dashboard.html'));
			}
		});
	} else{
	     res.redirect('/login');	
	}
});

app.get('/logout', function (req, res) {
	req.session.reset();
	res.redirect('/');
});

app.post('/register', function (req, res) {
	var user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password
	});

	user.save(function (err) {
		if(err) {
			res.send("Email Already Exist try using another email address.");
		}

		else {
			res.redirect('/login');
		}
	});
});

app.post('/login', function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if(!user) {
			res.send('Not an existing user.');
		}

		else {
			if(req.body.password === user.password) {
				req.session.user = user.email;
				res.redirect('/dashboard');
			}

			else {
				res.send("Invalid email/password");
			}
		}
	});
});

var port = 3000;
app.listen(port);
console.log("magic happens at " + port);