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
