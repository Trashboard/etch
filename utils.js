var getPixel = function(x, y, imagedata) {
    var index = (y * imagedata.width + x) * 4;
    var r = imagedata.data[index];
    var g = imagedata.data[index+1];
    var b = imagedata.data[index+2];
    var a = imagedata.data[index+3];
    var grey = Math.round((r * 0.21) + (g * 0.71) + (b * 0.07));

    return {
      r: r,
      g: g,
      b: b,
      a: a,
      grey: grey
    };
};

var setPixel = function(x, y, imagedata, r, g, b, a) {
  g === void 0 ? (g = r) : 0;
  b === void 0 ? (b = g) : 0;
  a === void 0 ? (a = 255) : 0;

  var index = (y * imagedata.width + x) * 4;
  imagedata.data[index] = r;
  imagedata.data[index + 1] = g;
  imagedata.data[index + 2] = b;
  imagedata.data[index + 3] = a;
}
