$(document).ready(function() {
  var windowWidth=window.innerWidth || root.clientWidth || body.clientWidth;
  var windowHeight=(window.innerHeight || root.clientHeight || body.clientHeight)*.95;
  var topLayerImage, completeImage;
  var canvas = document.getElementById("mainCanvas");
  var context = canvas.getContext("2d");
  var imageObj = new Image();
  var canvasXPos, canvasYPos, canvasWidth, canvasHeight;
  canvas.width=windowWidth*4;
  canvas.height=windowHeight*4;
  $(canvas).css({position: 'absolute', marginTop: (-2*windowHeight)+'px', marginLeft: (-2*windowWidth)+'px'});
  imageObj.onload = function(){
    var result=centerCanvas(windowWidth,windowHeight,imageObj.width,imageObj.height);
    canvasXPos=result.canvasXPos; canvasYPos=result.canvasYPos; canvasWidth=result.canvasWidth; canvasHeight=result.canvasHeight;
    context.drawImage(this, canvasXPos, canvasYPos,canvasWidth,canvasHeight);
    topLayerImage=context.getImageData(canvasXPos,canvasYPos,canvasWidth,canvasHeight);
    completeImage=context.getImageData(canvasXPos,canvasYPos,canvasWidth,canvasHeight);
  };   
  imageObj.src = "images/creative4.jpg";
  
  var tool=0; //0: pan
  $(".layerTool").click(function(e){
    $(".layerTool").removeClass("select");
    $(this).addClass("select");
  });
  
  var firstClick=false, mouseXOrig, mouseYOrig, mouseX, mouseY;
  $(canvas).mousedown(function(e) {
    if (tool==0){ //pan
      if (firstClick==false){
        mouseXOrig=e.pageX;
        mouseYOrig=e.pageY;
        mouseX=e.pageX;
        mouseY=e.pageY;
        firstClick=true;
        $(canvas).mousemove(function(evt) {
          mouseX=evt.pageX;
          mouseY=evt.pageY;
          var offsetX=canvasXPos-(mouseXOrig-mouseX);
          var offsetY=canvasYPos-(mouseYOrig-mouseY);
          context.clearRect(0,0,canvas.width,canvas.height);
          context.putImageData(completeImage,offsetX,offsetY);
        });
      }
    }
  });
  $(canvas).mouseup(function() {
    if(tool==0){ //pan
      firstClick=false;
      context.clearRect(0,0,canvas.width,canvas.height);
      canvasXPos=canvasXPos-(mouseXOrig-mouseX);
      canvasYPos=canvasYPos-(mouseYOrig-mouseY);
      context.putImageData(completeImage,canvasXPos,canvasYPos);
      $(canvas).unbind("mousemove");
    }
  });
  
  $("input[type='range']").change(function(e){
    e.preventDefault();
    var imgData=copyImageData(context, topLayerImage);
    updateAdjustment(this, imgData);
    context.putImageData(imgData,canvasXPos,canvasYPos);
    completeImage=imgData;
  });
  $("input[type='text']").change(function(e){
    e.preventDefault();
    var imgData=copyImageData(context, topLayerImage);
    updateAdjustment(this, imgData);
    context.putImageData(imgData,canvasXPos,canvasYPos);
    completeImage=imgData;
  });
  $("#header").click(function(e){
    $(".a2").css({textShadow: '0px 0px 1px white'});
    extendHeader(this);
  });
  $("#header").mouseleave(function(e){
    $(".a2").css({textShadow: 'none'});
    reverseHeader(this,function(){
      if($(".dropDown").is(':visible'))
        $(".dropDown").hide();
    });
  });
  $('.a2').click(function(e){
    e.preventDefault();
  });
  $('#centerImg').click(function(){
    var result=centerCanvas(windowWidth, windowHeight, canvasWidth, canvasHeight);
    canvasXPos=result.canvasXPos; canvasYPos=result.canvasYPos; canvasWidth=result.canvasWidth; canvasHeight=result.canvasHeight;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.putImageData(completeImage,canvasXPos,canvasYPos);
  });
});

function updateAdjustment(element, imgData){
  var effect=$(element).attr('name');
  var value=$(element).val();
  $('input[name='+effect+']').val(value);
  
  imgData=adjustBrightness(imgData, $('input[name=brightness][type=text]').val());
  imgData=adjustExposure(imgData, $('input[name=exposure][type=text]').val());
  imgData=adjustFillLight(imgData, $('input[name=fillLight][type=text]').val());
  imgData=adjustContrast(imgData, $('input[name=contrast][type=text]').val());
  imgData=adjustSaturation(imgData, $('input[name=saturation][type=text]').val());
  imgData=adjustVibrance(imgData, $('input[name=vibrance][type=text]').val());
  imgData=adjustHue(imgData, $('input[name=hue][type=text]').val());
  imgData=adjustGamma(imgData, $('input[name=gamma][type=text]').val());
  return imgData;
}

function extendHeader(element){
  $(element).stop().animate({height: "200px"}, 300, function(){
    $(".dropDown").stop().show(300);
  });
}
function reverseHeader(element,callback){
  $(".dropDown").stop().hide(300, function(){
    $(element).animate({height: "35px"}, 300, function(){
      if (callback && typeof(callback) === "function") {
        callback();
      }
    });
  });
}

function centerCanvas(windowWidth, windowHeight, width, height){
  var canvasXPos, canvasYPos, canvasWidth, canvasHeight, multiplier;
  if(height>width){
      multiplier=(height)/(windowHeight);
      canvasXPos=(windowWidth)*.5-width/(2*multiplier)+windowWidth*2;
      canvasYPos=windowHeight*2;
      canvasWidth=width/multiplier;
      canvasHeight=windowHeight;
  }
  if(height<width){
      multiplier=(width)/(windowWidth*.55);
      canvasXPos=windowWidth*2.22;
      canvasYPos=(windowHeight)*.5-height/(2*multiplier)+windowHeight*2;
      canvasWidth=windowWidth*.55;
      canvasHeight=height/multiplier;
  }
  return {canvasXPos: canvasXPos, canvasYPos: canvasYPos, canvasWidth: canvasWidth, canvasHeight: canvasHeight};
}