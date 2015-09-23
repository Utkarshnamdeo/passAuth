//dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var session = require('client-sessions');
var bcrypt = require('bcryptjs');

//for mongoose
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// to handle static files i.e attached javascripts or css
app.use(express.static(__dirname + '/'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

//using sessions to set cokkie and remember current user
app.use(session({
	cookieName: 'session',
	secret: 'utkarsh',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000, // not necessary
	httpOnly: true, // dont let malicious javascript to run 
	secure: true, // use only cookies
	ephermal: true // delete cookies on browser close 
}));

//connection mongoose to sss collection
mongoose.connect('mongodb://localhost:27017/sss');

var data = new Schema({
	id: ObjectId,
	firstname: String,
	lastname: String, 
	email: { type: String, unique: true},
	password: String
});

var User = mongoose.model('User', data);

//---------------------routes to handle get and post request---------------------------
app.get('/', function (req, res) {
	res.render('index', { title: 'Express', logo: 'SessionAuth' });
});

app.get('/login', function (req, res) {
	res.render('login', { title: 'Express', logo: 'SessionAuth' })
});

app.get('/register', function (req, res) {
	res.render('register', { title: 'Express', logo: 'SessionAuth' });
});

app.get('/dashboard', function (req, res) {
	if(req.session && req.session.user) {
		User.findOne({ emil: req.session.user.email }, function (err, user) {
			if(err) {
					res.render('login', { error: "Can't fetch Dashboard."});
			}
			else { 

				if(!user) {
					req.session.reset();
					res.redirect('/login');
				}	
				else {
					res.locals.user = req.user;
				User.findOne({ emil: req.session.user.email }, function (err, user) {
					res.render('dashboard', { title: 'Express', logo: 'SessionAuth', name: user.firstname });	
				});
				}
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
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);

	var user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: hash,
	});

	user.save(function (err) {
		if(err) {
			res.render('login', { error: "something went wrong" });
		}

		else {
			res.redirect('/login');
		}
	});
});


app.post('/login', function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if(!user) {
			res.render('login', { error: "Not a valid user." });
		}

		else {
			if(bcrypt.compareSync(req.body.password, user.password)) {
				req.session.user = user.email;
				res.redirect('/dashboard');
			} 

		else {
			res.render('login', { error: "Email/password didn't match."});
			}
		}
	});
});
 
//-----------specifying port number------------------------------- 
var port = 3000;
app.listen(port);
console.log("magic happens at " + port);
