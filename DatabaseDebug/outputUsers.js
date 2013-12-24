/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var pg = require('pg').native;

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
var query = postgresClient.query("SELECT * FROM users");
//fired after last row is emitted

query.on('row', function(row) {
  console.log(row);
});

query.on('end', function() { 
  postgresClient.end();
});