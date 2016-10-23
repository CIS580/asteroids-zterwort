"use strict";

const MS_PER_FRAME = 1000/8;

module.exports = exports = Ufo;

function Ufo(canvas){
  this.x = -100;
  this.y = canvas.height - 100;
  this.width = 5;
  this.height = 5;
  this.sprite = new Image();
  this.sprite.src = 'assets/Ufo.png';
  this.angle = -2.5*Math.PI;
  this.velocity = {
    x: 1,
    y: 1
  }
}

Ufo.prototype.update = function(level){
  var direction = {
    x: -Math.sin(this.angle) * (1 + level * 10),
    y: -Math.cos(this.angle) * (1 + level * 10)
  }
  this.x += direction.x;
  this.y += direction.y;
}

Ufo.prototype.render = function (ctx) {
  ctx.drawImage(
    this.sprite,
    this.x, this.y
  );
}
