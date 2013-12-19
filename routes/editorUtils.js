var Canvas=require('canvas');

exports.initImage = function(req, res){
  var imgObject=new Canvas.Image;
  imgObject.onload = function(){
    var canvas=new Canvas(imgObject.width,imgObject.height);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(imgObject,0,0,imgObject.width,imgObject.height);
    var imgData=ctx.getImageData(0,0,imgObject.width,imgObject.height);
    ctx.drawImage(imgObject,0,0,32,32);
    var tnData=ctx.getImageData(0,0,32,32);
    res.json({baseImage: imgData,tn: tnData});
  }
  imgObject.onerror = function(err){
    console.log(err);
  };
  imgObject.src = '/home/action/PixelProdigy/public/images/creative6.jpg';
};

function centerCanvas(windowWidth, windowHeight, width, height){
  var canvasXPos, canvasYPos, canvasWidth, canvasHeight, multiplier;
  if(height>width){
      multiplier=(height)/(windowHeight);
      canvasXPos=(windowWidth)*.5-width/(2*multiplier)+windowWidth*2;
      canvasYPos=windowHeight*2;
      canvasWidth=width/multiplier;
      canvasHeight=windowHeight;
  }
  else{
      multiplier=(width)/(windowWidth*.55);
      canvasXPos=windowWidth*2.22;
      canvasYPos=(windowHeight)*.5-height/(2*multiplier)+windowHeight*2;
      canvasWidth=windowWidth*.55;
      canvasHeight=height/multiplier;
  }
  return {canvasXPos: canvasXPos, canvasYPos: canvasYPos, canvasWidth: canvasWidth, canvasHeight: canvasHeight, zoom:1};
}