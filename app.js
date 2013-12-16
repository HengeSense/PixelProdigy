/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var pg = require('pg').native;
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var app = express();

// all environments
app.set('title', 'Pixel Prodigy');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//postgres
var postgresClient = new pg.Client({
  user: 'ooohcpmyoblzen',
  password: '45lRLX0n9MDBx4pLiW92qDn3Ot',
  host: 'ec2-54-204-37-113.compute-1.amazonaws.com',
  port: '5432',
  database: 'dat2018ie4nsap'
});
postgresClient.connect(function(err) {
  if(err)
    return console.error('could not connect to postgres', err);
});

//passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    var query = postgresClient.query("SELECT * FROM users WHERE user_name=$1",[username],function(err, result) {
      if(err)
        return done(err);
      else {
        if (result.rows[0].user_password==password)
          return done(null, result.rows[0]);
        else
           return done(null, false, {message: 'Incorrect password.'});
      }
    });
  }
));
passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});
passport.deserializeUser(function(id, done) {
    var query = postgresClient.query("SELECT * FROM users WHERE user_id=$1",[id],function(err, result) {
        done(err, result.rows[0]);
    });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/login',
    passport.authenticate('local', {successRedirect: '/account', failureRedirect: '/'})
);
app.get('/account', function(req, res) {
  res.render('account', {user: req.user});
});
app.get('/completeEditor', function(req, res) {
  res.render('editor');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
