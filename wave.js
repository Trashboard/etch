var wave = function(src, callback) {
  var canvas = document.createElement("canvas");
  canvas.width = 890;
  var ctx = canvas.getContext("2d");
  var img = new Image();

  rowHeight = window.rowHeight;

  var pixels = [];

  img.onload = function() {
     canvas.height = (canvas.width / img.width) * img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);


    for (var x = 0; x < canvas.width; x++) {
      for (var step = 0; step < canvas.height / rowHeight; step ++) {
        var total = 0;
        for (var y = (step * rowHeight); y < (step * rowHeight) + rowHeight; y++) {
          var col = getPixel(x, y, imageData);
          total += col.grey;
        }

        pixels[step] || (pixels[step] = []);
        pixels[step][x] = (total / rowHeight | 0);

        for (var y = (step * rowHeight); y < (step * rowHeight) + rowHeight; y++) {
          setPixel(x, y, imageData, total / rowHeight | 0);
        }

      }
    }
    ctx.putImageData(imageData, 0, 0);

    callback(null, canvas, pixels);
  }

  img.src = src;
}
