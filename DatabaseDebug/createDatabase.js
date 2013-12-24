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

postgresClient.query("CREATE TABLE users(user_id BIGSERIAL PRIMARY KEY,user_password VARCHAR(20),user_email VARCHAR(40),date_added DATE,last_login DATE,library_id TEXT)");
postgresClient.query("CREATE TABLE libraries(library_id BIGSERIAL PRIMARY KEY,user_id BIGSERIAL,date_added DATE,photo_id TEXT)");
postgresClient.query("CREATE TABLE photos(photo_id BIGSERIAL PRIMARY KEY,user_id BIGSERIAL,date_added DATE,photo_width FLOAT,photo_height FLOAT,layer_id TEXT)");
postgresClient.query("CREATE TABLE layers(layer_id BIGSERIAL PRIMARY KEY,layer_type SMALLINT,x_pos FLOAT,y_pos FLOAT,layer_width FLOAT,layer_height FLOAT,image_data BYTEA)");
