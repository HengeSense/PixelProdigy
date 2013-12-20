var Canvas = require('canvas');
var fs = require('fs');
var maxJSON=1232;

exports.initImage = function(req, res){
  res.contentType('application/json');
  var imgObject=new Canvas.Image;
  imgObject.onload = function(){
    var canvasDim=exportDim(req.query.windowWidth,req.query.windowHeight,imgObject.width,imgObject.height);
    var canvas=new Canvas(canvasDim.canvasWidth,canvasDim.canvasHeight);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(imgObject,0,0,canvasDim.canvasWidth,canvasDim.canvasHeight);
    var imgData=ctx.getImageData(0,0,canvasDim.canvasWidth,canvasDim.canvasHeight);
    imgData = JSON.stringify(imgData);
    fs.writeFile("/home/action/PixelProdigy/tmpPhotoStreams/1.json",imgData, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    }); 
    res.send({baseImage: imgData});
  }
  imgObject.src = '/home/action/PixelProdigy/public/images/creative6.jpg';
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