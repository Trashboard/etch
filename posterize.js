var posterize = function(src, callback) {
  var canvas = document.createElement("canvas");
  canvas.width = 590;
  var ctx = canvas.getContext("2d");
  var img = new Image();
  window.steps = 3;

  var clampedGrey = function(col) {
    return Math.round((col.grey / 255) * steps) * (255 / (steps - 0)) | 0;
  }

  img.onload = function() {
    canvas.height = (canvas.width / img.width) * img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var col = getPixel(x, y, imageData);
        col.clampedGrey = clampedGrey(col); 
        setPixel(x, y, imageData, col.clampedGrey);
      }
    }
    ctx.putImageData(imageData, 0, 0);

    var clean = function() {
      var newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      var changes = 0;
      for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
          var offsetRange = 1;

          var col = clampedGrey(getPixel(x, y, imageData));
          var cols = [];

          for (var xOffset=-offsetRange;xOffset<=offsetRange;xOffset++) {
            for (var yOffset=-offsetRange;yOffset<=offsetRange;yOffset++) {
              var offsetx = x + xOffset;
              var offsety = y + yOffset;
              if (offsetx >= 0 && offsetx < canvas.width && offsety >= 0 && offsety < canvas.height) {
                cols.push(clampedGrey(getPixel(offsetx, offsety, imageData)));
              }
            }
          }

          var bins = {};
          _.each(cols, function(colour) {
            bins[colour] || (bins[colour] = 0);
            bins[colour] ++;
          });
          var mostCommon = 0;
          var finalColour;
          _.each(bins, function(count, colour) {
            if (count > mostCommon) {
              finalColour = colour;
              mostCommon = count;
            }
          });
          if (finalColour != col) {
            changes ++;
          }
          setPixel(x, y, newImageData, finalColour);
        }
      }
      ctx.putImageData(newImageData, 0, 0);
      return changes;
    }

    var autoClean = function() {
      setTimeout(function() {
        var changes = clean();
        if (changes > 0) {
          autoClean();
        } else {
          callback(null, canvas);
        }
      }, 0);
    }
    autoClean();
  }

  img.src = "pic.jpg";
}
