var photoid=1;

var pg = require('pg').native;
var Canvas = require('canvas');
var fs = require('fs');
var maxJSON=1232;

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
exports.initImage = function(req, res){
  res.send("null");
};
exports.loadPhoto = function(req, res){
  res.contentType('application/json');
  var photoQuery = postgresClient.query("SELECT * FROM photos WHERE photo_id=$1",[photoid]);
  photoQuery.on('row', function(row) {
    var canvasDim=exportDim(req.query.windowWidth,req.query.windowHeight,row.photo_width,row.photo_height);
    var canvas=new Canvas(canvasDim.width,canvasDim.height);
    var ctx=canvas.getContext('2d');
    var img = new Canvas.Image;
    img.onload = function(){
      ctx.drawImage(row.completeImage,0,0,canvasDim.width,canvasDim.height);
      var b64png = canvas.toDataURL();
      res.send({width:canvasDim.width,height:canvasDim.height,image:b64png,layers:row.layer_id});
    };
    img.src = row.completeImage; 
  });
};
exports.loadLayer = function(req, res){
  res.contentType('application/json');
  var canvas=new Canvas(req.query.photoWidth,req.query.photoHeight);
  var ctx=canvas.getContext('2d');
  var layerQuery = postgresClient.query("SELECT * FROM layers WHERE layer_id=$1",[req.query.layerID]);
  layerQuery.on('row', function(row) {
  });
};

function exportDim(windowWidth, windowHeight, width, height){
  var canvasWidth, canvasHeight, multiplier;
  if(height>width){
      multiplier=(height)/(windowHeight);
      canvasWidth=width/multiplier;
      canvasHeight=windowHeight;
  }
  else{
      multiplier=(width)/(windowWidth*.55);
      canvasWidth=windowWidth*.55;
      canvasHeight=height/multiplier;
  }
  return {canvasWidth: canvasWidth, canvasHeight: canvasHeight};
}