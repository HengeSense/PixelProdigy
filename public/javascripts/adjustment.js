function copyImageData(context, sourceImgData){
  var rv = context.createImageData(sourceImgData.width, sourceImgData.height);
  for (var i = 0; i < sourceImgData.data.length; ++i)
    rv.data[i] = sourceImgData.data[i];
  return rv;
}

function adjustBrightness(imgData, amount)
{
  var data = imgData.data;
  amount = Math.floor(255 * (amount / 100));
  for (var i=0;i<data.length;i+=4){
    data[i]+=amount;
    data[i+1]+=amount;
    data[i+2]+=amount;
  }
  return imgData;
}

function adjustExposure(imgData, amount)
{
  var data = imgData.data;
  var sum,inc;
  amount = Math.floor(255 * (amount / 100));
  for (var i=0;i<data.length;i+=4){
    sum=data[i]+data[i+1]+data[i+2];
    inc=(sum/(255*1.5))*amount;
    data[i]+=inc;
    data[i+1]+=inc;
    data[i+2]+=inc;
  }
  return imgData;
}

function adjustFillLight(imgData, amount)
{
  var data = imgData.data;
  var sum,inc;
  amount = Math.floor(255 * (amount / 100));
  for (var i=0;i<data.length;i+=4){
    sum=data[i]+data[i+1]+data[i+2];
    if (sum>255)
      inc=((255*3-sum)/(255))*amount*.2;
    else
      inc=((255*3-sum)/(255))*amount*.25;
    data[i]+=inc;
    data[i+1]+=inc;
    data[i+2]+=inc;
  }
  return imgData;
}

function adjustContrast(imgData, amount){
  amount *=.75;
  var data = imgData.data;
  var factor = (259 * (amount + 255)) / (255 * (259 - amount));
  for(var i=0;i<data.length;i+=4)
  {
    data[i] = (factor * ((data[i] - 128) + 128));
    data[i+1] = (factor * ((data[i+1] - 128) + 128));
    data[i+2] = (factor * ((data[i+2] - 128) + 128));
  }
  return imgData;
}

function adjustSaturation(imgData, amount)
{
  var data = imgData.data;
  amount *= -0.01;
  var max;
  for (var i=0;i<data.length;i+=4){
    max = Math.max(data[i], data[i+1], data[i+2]);
    if (data[i] !== max) {
      data[i] += (max - data[i]) * amount;
    }
    if (data[i+1] !== max) {
        data[i+1] += (max - data[i+1]) * amount;
    }
    if (data[i+2] !== max) {
      data[i+2] += (max - data[i+2]) * amount;
    }
  }
  return imgData;
}

function adjustVibrance(imgData, amount){
  var data = imgData.data;
  amount *= -1;
  var amt, avg, max;
  for (var i=0;i<data.length;i+=4){
    max = Math.max(data[i], data[i+1], data[i+2]);
    avg = (data[i] + data[i+1] + data[i+2]) / 3;
    amt = ((Math.abs(max - avg) * 2 / 255) * amount) / 100;
    if (data[i] !== max) {
      data[i] += (max - data[i]) * amt;
    }
    if (data[i+1] !== max) {
      data[i+1] += (max - data[i+1]) * amt;
    }
    if (data[i+2] !== max) {
      data[i+2] += (max - data[i+2]) * amt;
    }
  }
  return imgData; 
}

function adjustHue(imgData, amount){
  var b, g, h, hsv, r, _ref;
  var data = imgData.data;
  for (var i=0;i<data.length;i+=4){
      hsv = rgbToHSV(data[i], data[i+1], data[i+2]);
      h = hsv.h * 100;
      h += Math.abs(amount);
      h = h % 100;
      h /= 100;
      hsv.h = h;
      _ref = hsvToRGB(hsv.h, hsv.s, hsv.v), r = _ref.r, g = _ref.g, b = _ref.b;
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
  }
  return imgData;
}

function adjustGamma(imgData, amount){
  var data = imgData.data;
  for (var i=0;i<data.length;i+=4){
    data[i] = Math.pow(data[i] / 255, amount) * 255;
    data[i+1] = Math.pow(data[i+1] / 255, amount) * 255;
    data[i+2] = Math.pow(data[i+2] / 255, amount) * 255;
  }
  return imgData;
}

function hsvToRGB(h, s, v) {
  var b, f, g, i, p, q, r, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
  }
  return {r: Math.floor(r * 255), g: Math.floor(g * 255), b: Math.floor(b * 255)};
}

function rgbToHSV(r, g, b) {
  var d, h, max, min, s, v;
  r /= 255;
  g /= 255;
  b /= 255;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  v = max;
  d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
  h = (function() {
    switch (max) {
      case r:
        return (g - b) / d + (g < b ? 6 : 0);
      case g:
        return (b - r) / d + 2;
      case b:
        return (r - g) / d + 4;
    }
  })();
  h /= 6;
  }
  return {h: h,s: s,v: v};
}