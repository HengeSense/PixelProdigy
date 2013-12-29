/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var pg = require('pg').native;
var Canvas = require('canvas');
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

var imgObject=new Canvas.Image;
var canvas=new Canvas(683,1024);
var ctx=canvas.getContext('2d');
var library_id=[1];
var photo_id=[1];
var layer_id=[1,2];
imgObject.onload = function(){
  ctx.drawImage(imgObject,0,0,683,1024);
  var b64png = canvas.toDataURL();
  postgresClient.query("INSERT INTO users (user_name,user_password,user_email,date_added,last_login,library_id) VALUES ('ntsianos','password','ntsianos@ucla.edu','2013-12-23','2013-12-23',$1)",[library_id]);
  postgresClient.query("INSERT INTO libraries (user_id,date_added,photo_id) VALUES (1,'2013-12-23',$1)",[photo_id]);
  postgresClient.query("INSERT INTO photos (user_id,date_added,photo_width,photo_height,layer_id) VALUES (1,'2013-12-23',683,1024,$1)",[layer_id]);
  postgresClient.query("INSERT INTO layers (layer_type,x_pos,y_pos,layer_width,layer_height,image_data) VALUES (0,0,0,683,1024,'0')");
  postgresClient.query("INSERT INTO layers (layer_type,x_pos,y_pos,layer_width,layer_height,image_data) VALUES (1,0,0,683,1024,$1)",[b64png]);
}
imgObject.src = '/home/action/PixelProdigy/public/images/creative6.jpg';
