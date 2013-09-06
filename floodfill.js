var floodfill = function(data, x, y, id) {
  if (x < 0 || y < 0 || x > data.width || y > data.height) {
    return;
  }

  if (data.pixels[x][y].blob !== void 0) {
    return false;
  }

  var shade = data.pixels[x][y].shade;

  var queue = [];

  queue.push(data.pixels[x][y]);

  var border = [];

  var stopper = 50000;
  while(queue.length > 0 && stopper > 0) {
    var pixel = queue.pop();
    var xOffsets = [0, 1, 0, -1];
    var yOffsets = [-1, 0, 1, 0];
    var x = pixel.x;
    var y = pixel.y;

    pixel.blob = id;

    var hits = 0;
    for (var i=0;i<xOffsets.length;i++) {
      var xOffset = xOffsets[i];
      var yOffset = yOffsets[i];

      if (x + xOffset >= 0 && x + xOffset < data.width  &&
          y + yOffset >= 0 && y + yOffset < data.height) {

        var currentPixel = data.pixels[x + xOffset][y + yOffset];
        if (pixel.shade === currentPixel.shade || pixel.blob === currentPixel.blob) {
          hits ++;
        }

        if (currentPixel.blob === void 0 && pixel.shade === currentPixel.shade) {
          queue.push(currentPixel);
        }

      }
    }
    if (hits < 4) {
      border.push(pixel);
      pixel.edge = true;
    }
    stopper --;
  }

  return data;
}
