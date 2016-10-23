(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Laser = require('./laser.js');
const Asteroid = require('./asteroid.js');
const Ufo = require('./UFO.js')
;
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var lasers = [];
var asteroids = [];
var score = 0;
var gameOver = false;
var round = 0;
var lives = 3;
var invincibility = false;
var teleported = false;
var ufos = []
var ufoSpawned = false;
var ufoLaser = [];
var ufoShoot = false;


function init(){
  var asteroid1 = new Asteroid({x: 100, y: 100}, canvas, false);
  asteroids.push(asteroid1);
  var asteroid2 = new Asteroid({x: 200, y: 200}, canvas, false);
  asteroids.push(asteroid2);
  var asteroid3 = new Asteroid({x: 300, y: 300}, canvas, false);
  asteroids.push(asteroid3);
  var asteroid4 = new Asteroid({x: 400, y: 400}, canvas, false);
  asteroids.push(asteroid4);
  var asteroid5 = new Asteroid({x: 500, y: 500}, canvas, false);
  asteroids.push(asteroid5);
  var asteroid6 = new Asteroid({x: 100, y: 500}, canvas, false);
  asteroids.push(asteroid6);
  var asteroid7 = new Asteroid({x: 200, y: 400}, canvas, false);
  asteroids.push(asteroid7);
  var asteroid8 = new Asteroid({x: 300, y: 200}, canvas, false);
  asteroids.push(asteroid8);
  var asteroid9 = new Asteroid({x: 400, y: 300}, canvas, false);
  asteroids.push(asteroid9);
  var asteroid10 = new Asteroid({x: 500, y: 100}, canvas, false);
  asteroids.push(asteroid10);

  round++;

  player.level += .1;
  player.position.x = canvas.width / 2;
  player.position.y = canvas.height / 2;
}

init();

window.onkeydown = function(event) {
if(gameOver == false)
  switch(event.key) {
    case 'ArrowUp': // up
    case 'w':
      player.thrusting = true;
      break;
    case 'ArrowLeft': // left
    case 'a':
      player.steerLeft = true;
      break;
    case 'ArrowRight': // right
    case 'd':
      player.steerRight = true;
      break;
    case 'j':
      var laserToAdd = new Laser(player.position, canvas, player.angle);
      var laserAudio = new Audio();
      laserAudio.src = 'assets/laser.wav';
      laserAudio.volume = .3;
      laserAudio.play();
      lasers.push(laserToAdd);
      break;
    case 'k':
      if(teleported == false){
        player.position.x = Math.floor(Math.random() * canvas.width + 1);
        player.position.y = Math.floor(Math.random() * canvas.height + 1);
        invincibility = true;
        setTimeout(function(){
          invincibility = false;
        }, 3000);
        teleported = true;
      }
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  if(asteroids.length == 0){
    init();
  }
  if(!gameOver){
    setTimeout(function(){game.loop(timestamp)}, 1000/8);
  }
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  for (var i = 0; i < lasers.length; i++) {
    lasers[i].update(elapsedTime, player.level);
  }
  for (var z = 0; z < ufoLaser.length; z++) {
    ufoLaser[z].update(player.level);
  }
  for (var j = 0; j < asteroids.length; j++) {
    asteroids[j].update(player.level);
  }
    spawnUFO();
    if(ufos.length == 1){
      ufos[0].update(player.level);
    }
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx, invincibility);
  for (var i = 0; i < lasers.length; i++) {
    lasers[i].render(elapsedTime, ctx, false);
    if(lasers[i].x < 0 || lasers[i].x > canvas.width || lasers[i].y < 0 || lasers[i].y > canvas.height){
      //Remove laser from lasers[] if out of bounds
      lasers.splice(i, 1);
    }
  }

  for (var z = 0; z < ufoLaser.length; z++) {
    ufoLaser[z].render(elapsedTime, ctx, true);
    if(ufoLaser[z].x < 0 || ufoLaser[z].x > canvas.width || ufoLaser[z].y < 0 || ufoLaser[z].y > canvas.height){
      //Remove laser from lasers[] if out of bounds
      if(ufoLaser.length == 1)
      ufoLaser.splice(z, 1);
    }
  }

  for (var j = 0; j < asteroids.length; j++) {
    asteroids[j].render(elapsedTime, ctx);
  }
  checkLaserOnAsteroid();
  checkPlayerOnAsteroid();
  checkLaserOnPlayer();
  //checkAsteroidOnAsteroid();
  if(ufos.length == 1){
    ufos[0].render(ctx);
  }

  if(ufos.length == 1){
    if(ufos[0].x < -128){
      ufos.splice(0,1);
      ufoSpawned = false;
    }
    else if(ufos[0].x > canvas.width + 64){
      ufos.splice(0,1);
      ufoSpawned = false;
    }
    else if(ufos[0].y < -128){
      ufos.splice(0,1);
      ufoSpawned = false;
    }
    else if(ufos[0].y > canvas.height + 64){
      ufos.splice(0,1);
      ufoSpawned = false;
    }
  }

  var text = "Score: " + score;
  ctx.fillStyle = 'white';
  ctx.fillText(text, 10, 20);
  var roundText = "Level: " + round;
  ctx.fillText(roundText, 10, 30);
  var livesText = "Lives: " + lives;
  ctx.fillText(livesText, 10, 40);
}

function checkLaserOnPlayer(){
  for (var n = 0; n < ufoLaser.length; n++) {
    if((ufoLaser[n].x < player.position.x + 10 && ufoLaser[n].x > player.position.x) && (ufoLaser[n].y > player.position.y && ufoLaser[n].y < player.position.y + 10)){
      invincibility = true;
      lives -= 1;
      teleported = false;
      var lostLife = new Audio();
      lostLife.src = 'assets/lost-life.wav';
      lostLife.volume = 1;
      lostLife.play();
      if(lives == 0){
        gameOver = true;
      }
      else {
        player.position.x = canvas.width / 2;
        player.position.y = canvas.height / 2;
        player.velocity.x = 0;
        player.velocity.y = 0;
        setTimeout(function(){
          invincibility = false;
        }, 3000);
        return;
    }
  }
}
}

function checkPlayerOnAsteroid(){
  for (var j = 0; j < asteroids.length; j++) {
    if(asteroids[j].isBig == true){
      if((player.position.x + 5 < asteroids[j].x + 64 && player.position.x + 5 > asteroids[j].x) && (player.position.y + 5 > asteroids[j].y && player.position.y + 5 < asteroids[j].y + 64) && invincibility == false){
        invincibility = true;
        lives -= 1;
        teleported = false;
        var lostLife = new Audio();
        lostLife.src = 'assets/lost-life.wav';
        lostLife.volume = 1;
        lostLife.play();
        if(lives == 0){
          gameOver = true;
        }
        else {
          player.position.x = canvas.width / 2;
          player.position.y = canvas.height / 2;
          player.velocity.x = 0;
          player.velocity.y = 0;
          setTimeout(function(){
            invincibility = false;
          }, 3000);
          return;
        }
      }
    }
    else {
      {
        if((player.position.x + 5 < asteroids[j].x + 32 && player.position.x + 5 > asteroids[j].x) && (player.position.y + 5 > asteroids[j].y && player.position.y + 5 < asteroids[j].y + 32) && invincibility == false){
          invincibility = true;
          lives -= 1;
          teleported = false;
          var lostLife = new Audio();
          lostLife.src = 'assets/lost-life.wav';
          lostLife.volume = 1;
          lostLife.play();
          if(lives == 0){
            gameOver = true;
          }
          else {
            player.position.x = canvas.width / 2;
            player.position.y = canvas.height / 2;
            player.velocity.x = 0;
            player.velocity.y = 0;
            setTimeout(function(){
              invincibility = false;
            }, 3000);
            return;
          }
        }
      }
    }
  }
}

function checkLaserOnAsteroid(){
  for (var i = 0; i < lasers.length; i++) {
    for (var j = 0; j < asteroids.length; j++) {
      if(asteroids[j].isBig == true){
        if((lasers[i].x < asteroids[j].x + 64 && lasers[i].x > asteroids[j].x) && (lasers[i].y > asteroids[j].y && lasers[i].y < asteroids[j].y + 64)){
          var asteroidExplosion = new Audio();
          asteroidExplosion.src = 'assets/asteroid-explosion.wav';
          asteroidExplosion.volume = .6;
          asteroidExplosion.play();
          spawnBabyAsteroids(asteroids[j]);
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          score += 10
          return;
        }
      }
      else{
        if((lasers[i].x < asteroids[j].x + 32 && lasers[i].x > asteroids[j].x) && (lasers[i].y > asteroids[j].y && lasers[i].y < asteroids[j].y + 32)){
          var asteroidExplosion = new Audio();
          asteroidExplosion.src = 'assets/asteroid-explosion.wav';
          asteroidExplosion.volume = .6;
          asteroidExplosion.play();
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          score += 10
          return;
        }
      }
    }
  }
}

function checkAsteroidOnAsteroid(){
  var big = 64;
  var small = 32;
  for (var i = 0; i < asteroids.length; i++) {
    for (var j = 0; j < asteroids.length; j++) {
      if(i != j){
        if(asteroids[i].isBig && asteroids[j].isBig){
          if(asteroids[i].x < asteroids[j].x + big && asteroids[i].x > asteroids[j].x && asteroids[i].y > asteroids[j].y && asteroids[i].y < asteroids[j].y + big){
            if(asteroids[i].colliding == false && asteroids[j].colliding == false){
              //asteroids[i].angle = -asteroids[i].angle;
              asteroids[j].angle = -asteroids[i].angle;
            }
            asteroids[i].colliding = true;
            asteroids[j].colliding = true;
          }
          else {
            asteroids[i].colliding = false;
            asteroids[j].colliding = false;
          }
        }
        if(asteroids[i].isBig && !asteroids[j].isBig){

        }
      }
    }
  }
}

function spawnBabyAsteroids(asteroid){
  var babyAsteroid1 = new Asteroid({x: asteroid.x, y: asteroid.y}, canvas, true);
  babyAsteroid1.changeAngleAndMass (babyAsteroid1.angle, true, asteroid.mass);
  asteroids.push(babyAsteroid1);
  var babyAsteroid2 = new Asteroid({x: asteroid.x, y: asteroid.y}, canvas, true);
  babyAsteroid2.changeAngleAndMass(babyAsteroid2.angle, false, asteroid.mass);
  asteroids.push(babyAsteroid2);
}

function spawnUFO(){
  if(ufoSpawned == false){
    var random = Math.floor(Math.random() * 3 + 1) * 1000;
    setTimeout(function(){
      var randomX = Math.floor(Math.random() * canvas.width + 1);
      var randomY = Math.floor(Math.random() * canvas.height + 1);
      var ufo = new Ufo(canvas);
      ufos.push(ufo);
    }, random);
    ufoSpawned = true;
  }
  else{
    if(ufoShoot == false){
      setTimeout(function(){
        if(ufos.length == 1){
          var laserToAdd = new Laser({x: ufos[0].x, y: ufos[0].y }, canvas, 2 * Math.PI);
          var laserAudio = new Audio();
          laserAudio.src = 'assets/laser.wav';
          laserAudio.volume = .3;
          laserAudio.play();
          ufoLaser.push(laserToAdd);
        }
        ufoShoot = false;
      }, 2000);
      ufoShoot = true;
    }
  }
}

},{"./UFO.js":1,"./asteroid.js":3,"./game.js":4,"./laser.js":5,"./player.js":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.level = 0;

  var self = this;

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
    }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.003;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
  }
  // Apply velocity
  this.position.x += this.velocity.x * this.level;
  this.position.y += this.velocity.y * this.level;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx, invincibility) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  if(invincibility){
    ctx.strokeStyle = '#00FBFF'
  }
  else {
    ctx.strokeStyle = 'white';
  }
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

},{}]},{},[2]);
