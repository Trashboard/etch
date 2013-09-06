var fs = require("fs");
var argv = require("optimist").argv;
var Canvas = require("canvas");
var Image = Canvas.Image;

module.exports = function(input, output, callback) {
  callback || (callback = function(){});

  var rowHeight = 10;

  var pixels = [];

  var src = input;
  var targetWidth = 850;

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
  }

  fs.readFile(src, function(err, data){
    if (err) throw err;

    var img = new Image();
    img.src = data;

    var canvas = new Canvas(targetWidth, (targetWidth / img.width) * img.height);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
      for (var step = 0; step < canvas.height / rowHeight; step ++) {
        var total = 0;
        for (var y = (step * rowHeight); y < (step * rowHeight) + rowHeight; y++) {
          var col = getPixel(x, y, imageData);
          total += col.grey;
        }

        pixels[step] || (pixels[step] = []);
        pixels[step][x] = (total / rowHeight | 0);
      }
    }

    ctx.putImageData(imageData, 0, 0);


    var waveCanvas = new Canvas(canvas.width, canvas.height);
    var ctx = waveCanvas.getContext("2d");
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (var ry = 0; ry < pixels.length; ry++) {
      var y = (ry * rowHeight) + (rowHeight / 2) | 0;
      var rads = 0;
      var dir = ry % 2;
      for (var x = 0; x < pixels[0].length; x++) {
        var rx = x;
        if (dir === 1) {
          rx = (pixels[0].length - 1) - x;
        }

        var c = pixels[ry][rx];
        var val = (c / 255);
        rads += (1 - (val * val)) * 1.5;
        ctx.lineTo(rx, y + (Math.sin(rads) * (rowHeight / 2)) * ((1 - val) * 1));
      }
    }

    ctx.stroke();

    var out = fs.createWriteStream(output)
      , stream = waveCanvas.createJPEGStream();

    stream.on('data', function(chunk){
      out.write(chunk);
    });
    stream.on("end", function() {
      callback();
    });
  });
}

if(require.main === module) {
  module.exports(argv._[0], argv._[1]);
}
