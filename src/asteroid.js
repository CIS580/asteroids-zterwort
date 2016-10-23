"use strict";

module.exports = exports = Asteroid;

function Asteroid(pos, canvas, baby){
  this.x = pos.x;
  this.y = pos.y;
  this.colliding = false;
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.width = 20;
  this.height = 20;
  var random = Math.random(2) * Math.PI;
  this.angle = random;
  random = Math.random(2);
  this.mass = random;
  this.sprite = new Image();
  this.isBig = false;
  if(baby){
    this.sprite.src = 'assets/small-asteroid.png'
  }
  else {
    this.sprite.src = 'assets/big-asteroid.png';
    this.isBig = true;
  }
  this.velocity = {
    x: 1,
    y: 1
  }
}

Asteroid.prototype.update = function(level){
  var direction = {
    x: -Math.sin(this.angle) * (this.mass + level * 10),
    y: -Math.cos(this.angle) * (this.mass + level * 10)
  }
  this.x += direction.x;
  this.y += direction.y;

  if(this.isBig){
    if(this.x < -64) this.x += (this.worldWidth + 64);
    if(this.x > this.worldWidth + 64) this.x -= (this.worldWidth + 64);
    if(this.y < -64) this.y += (this.worldHeight + 64);
    if(this.y > this.worldHeight + 64) this.y -= (this.worldHeight + 64);
  }
  else{
    if(this.x < -32) this.x += (this.worldWidth + 32);
    if(this.x > this.worldWidth + 32) this.x -= (this.worldWidth + 32);
    if(this.y < -32) this.y += (this.worldHeight + 32);
    if(this.y > this.worldHeight + 32) this.y -= (this.worldHeight + 32);
  }
}

Asteroid.prototype.changeAngleAndMass = function(angle, first, mass){
  if(first == true){
    this.angle = angle + 1;
  }
  else {
    this.angle = angle - 1;
  }
  this.mass = mass / 100;
}


Asteroid.prototype.render = function(time, ctx) {
  if(this.isBig == true){
    ctx.drawImage(
      this.sprite,
      this.x, this.y
    );
  }
  else {
    ctx.drawImage(
      this.sprite,
      this.x, this.y, 32, 32
    );
  }
}
