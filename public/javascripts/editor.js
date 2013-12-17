$(document).ready(function() {
  //** CANVAS INIT AND GENERAL **
  var windowWidth=window.innerWidth || root.clientWidth || body.clientWidth;
  var windowHeight=(window.innerHeight || root.clientHeight || body.clientHeight)*.95;
  var topLayerImage, completeImage, completeImageZoom;
  var canvas = document.getElementById("mainCanvas");
  var context = canvas.getContext("2d");
  var imageObj = new Image();
  var canvasDim={canvasXPos:0, canvasYPos:0, canvasWidth:0, canvasHeight:0, zoom:1};
  canvas.width=windowWidth*4;
  canvas.height=windowHeight*4;
  $(canvas).css({position: 'absolute', marginTop: (-2*windowHeight)+'px', marginLeft: (-2*windowWidth)+'px'});
  imageObj.onload = function(){
    canvasDim=centerCanvas(windowWidth,windowHeight,imageObj.width,imageObj.height);
    context.drawImage(this, canvasDim.canvasXPos, canvasDim.canvasYPos,canvasDim.canvasWidth,canvasDim.canvasHeight);
    topLayerImage=context.getImageData(canvasDim.canvasXPos,canvasDim.canvasYPos,canvasDim.canvasWidth,canvasDim.canvasHeight);
    completeImage=context.getImageData(canvasDim.canvasXPos,canvasDim.canvasYPos,canvasDim.canvasWidth,canvasDim.canvasHeight);
    completeImageZoom=context.getImageData(canvasDim.canvasXPos,canvasDim.canvasYPos,canvasDim.canvasWidth,canvasDim.canvasHeight);
  };   
  imageObj.src = "images/creative4.jpg";
  
  //** TOOL BINDINGS **
  var tool="Pan";
  $(".layerTool").click(function(e){
    $(".layerTool").removeClass("select");
    $(this).addClass("select");
    tool=$(this).attr("title");
  });
  
  var firstClick=false, mouseXOrig, mouseYOrig, mouseX, mouseY;
  $(canvas).mousedown(function(e) {
    if (tool=="Pan"){
      if (firstClick==false){
        mouseXOrig=e.pageX;
        mouseYOrig=e.pageY;
        mouseX=e.pageX;
        mouseY=e.pageY;
        firstClick=true;
        $(canvas).mousemove(function(evt) {
          mouseX=evt.pageX;
          mouseY=evt.pageY;
          var offsetX=canvasDim.canvasXPos-(mouseXOrig-mouseX);
          var offsetY=canvasDim.canvasYPos-(mouseYOrig-mouseY);
          context.clearRect(0,0,canvas.width,canvas.height);
          context.putImageData(completeImageZoom,offsetX,offsetY);
        });
      }
    }
    else if(tool=="Zoom In"){
      if (firstClick==false){
        canvasDim.zoom *=2;
        completeImageZoom=zoomCanvas(context, completeImage, completeImageZoom, canvasDim, e);
        context.clearRect(0,0,canvas.width,canvas.height);
        context.putImageData(completeImageZoom,canvasDim.canvasXPos,canvasDim.canvasYPos);
        firstClick=true;
      }
    }
    else if(tool=="Zoom Out"){
      if (firstClick==false && canvasDim.zoom>1){
        canvasDim.zoom /=2;
        completeImageZoom=zoomCanvas(context, completeImage, completeImageZoom, canvasDim, e);
        context.clearRect(0,0,canvas.width,canvas.height);
        context.putImageData(completeImageZoom,canvasDim.canvasXPos,canvasDim.canvasYPos);
        firstClick=true;
      }
    }
  });
  $(canvas).mouseup(function() {
    firstClick=false;
    if(tool=="Pan"){
      context.clearRect(0,0,canvas.width,canvas.height);
      canvasDim.canvasXPos=canvasDim.canvasXPos-(mouseXOrig-mouseX);
      canvasDim.canvasYPos=canvasDim.canvasYPos-(mouseYOrig-mouseY);
      context.putImageData(completeImageZoom,canvasDim.canvasXPos,canvasDim.canvasYPos);
      $(canvas).unbind("mousemove");
    }
  });
  
  //** SETTINGS BINDINGS **
  $("input[type='range']").change(function(e){
    e.preventDefault();
    var imgData=copyImageData(context, topLayerImage);
    updateAdjustment(this, imgData);
    completeImageZoom=zoomCanvas(context, completeImage, imgData, canvasDim, e);
    context.putImageData(completeImageZoom,canvasDim.canvasXPos,canvasDim.canvasYPos);
  });
  $("input[type='text']").change(function(e){
    e.preventDefault();
    var imgData=copyImageData(context, topLayerImage);
    updateAdjustment(this, imgData);
    completeImageZoom=zoomCanvas(context, completeImage, imgData, canvasDim, e);
    context.putImageData(completeImageZoom,canvasDim.canvasXPos,canvasDim.canvasYPos);
  });
  
  //** HEADER BINDINGS **
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
    canvasDim=centerCanvas(windowWidth, windowHeight, canvasDim.canvasWidth, canvasDim.canvasHeight);
    context.clearRect(0,0,canvas.width,canvas.height);
    context.putImageData(completeImage,canvasDim.canvasXPos,canvasDim.canvasYPos);
  });
});

function updateAdjustment(element, imgData){
  if(element!=null){
    var effect=$(element).attr('name');
    var value=$(element).val();
    $('input[name='+effect+']').val(value);
  }
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
  return {canvasXPos: canvasXPos, canvasYPos: canvasYPos, canvasWidth: canvasWidth, canvasHeight: canvasHeight, zoom:1};
}

function zoomCanvas(context, originalData, imgData, canvasDim, e){
  if(canvasDim.zoom==1){
    var originalDataTemp=copyImageData(context, originalData);
    updateAdjustment(null, originalDataTemp);
    return originalDataTemp;
  }
  var scaled = context.createImageData((imgData.width)*(canvasDim.zoom), (imgData.height)*(canvasDim.zoom));
  for(var row = 0; row < imgData.height; row++) {
    for(var col = 0; col < imgData.width; col++) {
      var sourcePixel = [
        imgData.data[(row * imgData.width + col) * 4 + 0],
        imgData.data[(row * imgData.width + col) * 4 + 1],
        imgData.data[(row * imgData.width + col) * 4 + 2],
        imgData.data[(row * imgData.width + col) * 4 + 3]
      ];
      for(var y = 0; y < canvasDim.zoom; y++) {
        var destRow = row * canvasDim.zoom + y;
        for(var x = 0; x < canvasDim.zoom; x++) {
          var destCol = col * canvasDim.zoom + x;
          for(var i = 0; i < 4; i++) {
            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
              sourcePixel[i];
          }
        }
      }
    }
  }
  return scaled;
}