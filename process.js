$(function() {

  posterize("/pic.jpg", function(err, canvas) {
    $("body").append(canvas);
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var data = {
      width: imageData.width,
      height: imageData.height,
      pixels: []
    };

    for (var x=0;x<data.width;x++) {
      data.pixels.push([]);
      for (var y=0;y<data.height;y++) {
        data.pixels[x].push({
          x: x,
          y: y,
          blob: undefined,
          edge: undefined,
          shade: getPixel(x, y, imageData).grey
        });
      }
    }

    var id = 0;
    for (var y=0;y<data.height;y++) {
      for (var x=0;x<data.width;x++) {
        if (floodfill(data, x, y, id)) {
          id ++;
        };
      }
    }


    var lines = [];
    for (var i = 0; i < id; i++) {
      lines.push([]);
    }
    for (var y = 0; y < data.height; y++) {
      var previousPixel = undefined;
      var startPixel = undefined;

      for (var x = 0; x < data.width; x++) {
        var pixel = data.pixels[x][y];

        if (!startPixel) {
          startPixel = previousPixel = pixel;
          continue;
        }

        var blob = data.pixels[x][y].blob;
        if (blob !== previousPixel.blob || x === data.width -1) {
          lines[previousPixel.blob].push({
            start: startPixel,
            end: previousPixel
          });
          startPixel = previousPixel = pixel;
        }
        previousPixel = pixel;
      }
    }



    window.fillBlob = function(blob) {
      for (var x=0;x<data.width;x++) {
        for (var y=0;y<data.height;y++) {
          if (data.pixels[x][y].blob === blob) {
            setPixel(x, y, imageData, 255, 0, 0);
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    window.render = function() {
      var canvas = document.createElement("canvas");
      canvas.width = data.width;
      canvas.height = data.height;

      var ctx = canvas.getContext("2d");

      ctx.fillStyle = "#999999";
      ctx.fillRect(0, 0, data.width, data.height);

      ctx.fillStyle = "#333333";

      for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].length; j++) {
          var start = lines[i][j].start;
          var end = lines[i][j].end;
          var toSkip = Math.round(start.shade / 255 * window.steps) + 1;
          if (start.y % toSkip === 0 && toSkip !== window.steps + 1) {
            ctx.fillRect(start.x, start.y, end.x - start.x + 1, 1);
          }
        }
      }
      $("body").append(canvas);
    }
    render();



  });
});

