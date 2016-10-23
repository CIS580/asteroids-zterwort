"use strict";

const MS_PER_FRAME = 1000/8;

module.exports = exports = Laser;

function Laser(pos, canvas, angle){
  this.x = pos.x;
  this.y = pos.y;
  this.width = 5;
  this.height = 5;
  this.angle = angle;
  this.velocity = {
    x: 1,
    y: 1
  }
}


Laser.prototype.update = function(time, level){
  var direction = {
    x: -Math.sin(this.angle) * (.1 * 80),
    y: -Math.cos(this.angle) * (.1 * 80)
  }
  this.x += direction.x;
  this.y += direction.y;
}


Laser.prototype.render = function(time, ctx, ufo) {
  if(ufo){
    ctx.fillStyle = 'orange';
  }
  else {
    ctx.fillStyle = 'green';
  }
  ctx.fillRect(this.x, this.y, this.width, this.height);
}
