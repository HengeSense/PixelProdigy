/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var pg = require('pg').native;

//postgres
var postgresClient = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE
});
postgresClient.connect(function(err) {
  if(err)
    return console.error('could not connect to postgres', err);
});
var query = postgresClient.query("SELECT * FROM users");

query.on('row', function(row) {
  console.log(row);
});

query.on('end', function() { 
  postgresClient.end();
});