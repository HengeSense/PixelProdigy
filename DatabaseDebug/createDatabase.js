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

postgresClient.query("CREATE TABLE users(user_id BIGSERIAL PRIMARY KEY,user_name VARCHAR(20),user_password VARCHAR(20),user_email VARCHAR(40),date_added DATE,last_login DATE,library_id TEXT)");
postgresClient.query("CREATE TABLE libraries(library_id BIGSERIAL PRIMARY KEY,user_id BIGSERIAL,date_added DATE,photo_id TEXT)");
postgresClient.query("CREATE TABLE photos(photo_id BIGSERIAL PRIMARY KEY,user_id BIGSERIAL,date_added DATE,photo_width FLOAT,photo_height FLOAT,layer_id TEXT)");
postgresClient.query("CREATE TABLE layers(layer_id BIGSERIAL PRIMARY KEY,layer_type SMALLINT,x_pos FLOAT,y_pos FLOAT,layer_width FLOAT,layer_height FLOAT,image_data BYTEA)");
