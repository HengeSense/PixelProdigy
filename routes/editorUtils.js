var photoid=1;

var Canvas = require('canvas');
var fs = require('fs');
var maxJSON=1232;

exports.initImage = function(req, res){
  res.send("null");
};

exports.loadPhoto = function(req, res){
  res.contentType('application/json');
  var photoQuery = postgresClient.query("SELECT * FROM photos WHERE photo_id=$1",[photoid]);
  photoQuery.on('row', function(row) {
    var canvasDim=exportDim(req.query.windowWidth,req.query.windowHeight,row.photo_width,row.photo_height);
    res.send({width:canvasDim.width,height:canvasDim.height,layers:row.layer_id});
  });
};
exports.loadLayer = function(req, res){
  res.contentType('application/json');
  var layerQuery = postgresClient.query("SELECT * FROM layers WHERE layer_id=$1",[req.query.layerID]);
  layerQuery.on('row', function(row) {
    var canvas=new Canvas(req.query.photoWidth,req.query.photoHeight);
    var ctx=canvas.getContext('2d');
  };
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