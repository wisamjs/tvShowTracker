'use strict';

//require is built-in node command
//to load modules
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var User = require('./models/user');
var Show = require('./models/shows');
mongoose.connect('localhost');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Authentication and authorization
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;




var app = express();
app.set('port',process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//creates cookie if user is authenticated
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.get('/api/shows', function(req, res, next) {
  var query = Show.find();

  //if genre param passed
  if (req.query.genre) {
    query.where({ genre: req.query.genre });
  }
  //if alphabet parameter passed
  else if (req.query.alphabet) {
    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
  }
  else {
    query.limit(12);
  }
  //execute query
  query.exec(function(err, shows) {
    if (err) return next(err);
    res.send(shows);
  });
});


app.get('/api/shows/:id', function(req, res, next) {
  Show.findById(req.params.id, function(err, show) {
    if (err) return next(err);
    res.send(show);
  });
});

/*
Below code will allow users to refresh page
and not get weird "CANNOT GET /Add" error
common problem with HTML5 pushState on the client-side.
*/
app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

/*if email is found and passport is valid 
then a new cookie is created with the user object
and user object is sent back to client.

Note: Sending user password over network or in cookie
is a horrible idea! Find a better way to do this.
*/
app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

//TODO - add express-validator
app.post('/api/signup', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.get('/api/logout', function(req, res, next) {
  req.logout();
  res.send(200);
});

//Error middleware - returns error
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

//Passport methods to keep you signed in.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Passport methods to keep you signed in.
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Protect routes from unauthenticated requests
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}

//local strategy for local signin
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}





app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
