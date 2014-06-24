'use strict';

//require is built-in node command
//to load modules
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var user = require('./models/user');
var shows = require('./models/shows');
mongoose.connect('localhost');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
app.set('port',process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

//Error middleware - returns error
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});





app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
