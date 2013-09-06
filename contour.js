var ContourTracer = function(imageData, canvas) {
  this.imageData = imageData;
  this.canvas = canvas;
}

ContourTracer.prototype.step = function() {
  switch (this.direction) {
    case "up":
      this.y --;
    break;
    case "down":
      this.y ++;
    break;
    case "left":
      this.x --;
    break;
    case "right":
      this.x ++;
    break;
  }
  return this;
}

ContourTracer.prototype.rotate = function() {
  switch (this.direction) {
    case "up":
      this.direction = "right";
    break;
    case "right":
      this.direction = "down";
    break;
    case "down":
      this.direction = "left";
    break;
    case "left":
      this.direction = "up";
    break;
  }
  return this;
}

ContourTracer.prototype.rotateRight = function() {
  this.rotate();
  return this;
}

ContourTracer.prototype.rotateLeft = function() {
  this.rotate();
  this.rotate();
  this.rotate();
  return this;
}

ContourTracer.prototype.inView = function() {
  var p1, p2, p3;

  switch (this.direction) {
    case "up":
      p1 = {x: this.x-1, y: this.y-1};
      p2 = {x: this.x, y: this.y-1};
      p3 = {x: this.x+1, y: this.y-1};
    break;
    case "right":
      p1 = {x: this.x+1, y: this.y-1};
      p2 = {x: this.x+1, y: this.y};
      p3 = {x: this.x+1, y: this.y+1};
    break;
    case "down":
      p1 = {x: this.x+1, y: this.y+1};
      p2 = {x: this.x, y: this.y+1};
      p3 = {x: this.x-1, y: this.y+1};
    break;
    case "left":
      p1 = {x: this.x-1, y: this.y+1};
      p2 = {x: this.x-1, y: this.y};
      p3 = {x: this.x-1, y: this.y-1};
    break;
  }

  return {
    p1: p1,
    p2: p2,
    p3: p3
  }

}

ContourTracer.prototype.isValidMove = function(p) {
  if (p.x < 0 || p.y < 0 || p.x >= this.canvas.width || p.y >= this.canvas.height) {
    return false;
  }
  var index = (p.y * this.canvas.width + p.x) * 4;
  return this.imageData.data[index] === this.colour;
}

ContourTracer.prototype.getPosition = function() {
  return {
    x: this.x,
    y: this.y
  }
}

ContourTracer.prototype.start = function(position, colour, callback) {
  this.route = [];
  this.start = position;
  this.x = this.start.x;
  this.y = this.start.y;
  this.colour = colour;
  this.callback = callback || function(){};
  this.direction = "up";
  this.startHits = 0;
  this.move();
}

ContourTracer.prototype.move = function() {
  var view = this.inView();
  var position;
  if (this.isValidMove(view.p1)) {
    this.step().rotateLeft().step();
  } else if (this.isValidMove(view.p2)) {
    this.step();
  } else if (this.isValidMove(view.p3)) {
    this.rotateRight().step().rotateLeft().step();
  } else {
    this.rotateRight();
  }
  position = this.getPosition();
  this.addMove(position);
}

ContourTracer.prototype.addMove = function(position) {
  if (position.x === this.start.x && position.y === this.start.y) {
    this.startHits ++;
  }
  if (this.startHits === 3 || this.route.length > 100000) {
    this.callback(this.route);
  } else {
    this.route.push(position);
    this.move();
  }
}


