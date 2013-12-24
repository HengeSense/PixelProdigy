/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var pg = require('pg').native;

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

var query = postgresClient.query("SELECT * FROM libraries");
query.on('row', function(row) {
  console.log(row);
});
      
