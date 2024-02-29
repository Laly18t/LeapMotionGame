import "./reset.css";
import Asteroid from "./src/Asteroid";
import Bullet from "./src/Bullet";
import GameEngine from "./src/GameEngine";
import Player from "./src/Player";
import LeapMotion from "./src/LeapMotion";
import globals from "./src/globals";
import "./style.css";

let secondsPassed;
let oldTimeStamp = 0;
let fps;

let player;
let bullets = [];
let asteroids = [];

const getMouseCoords = (event, gameCanvas) => {
  return {
    x: (event.clientX - gameCanvas.boundingRect.left) * gameCanvas.scaleX,
    y: (event.clientY - gameCanvas.boundingRect.top) * gameCanvas.scaleY,
  };
};

const handleFire = () => {
  bullets.push(new Bullet(player.x + player.width / 2 - 5, player.y, 3, 10));
};

const handleGenerateAsteroid = () => {
  // random size
  const randomWidth = Math.random() * 50 + 50;
  const randomHeight = Math.random() * 50 + 50;

  const randomX = Math.random() * (globals.viewport.width - randomWidth);
  const randomY = -randomHeight;
  // random speed
  const randomSpeed = Math.random() * 2 + 5;

  //random image pour l'ennemi
  const randomImg = [
    "asteroid1.png",
    "asteroid2.png",
    "asteroid3.png",
    "asteroid4.png",
  ];
  asteroids.push(
    new Asteroid(randomX, randomY, randomWidth, randomHeight, randomSpeed, randomImg)
  );
};

const initEvents = () => {

  const fireWS = new WebSocket("ws://localhost:8080");
  fireWS.onopen = () => {
    console.log("WebSocket Opened");
  };

  fireWS.onmessage = (event) => {
    console.log(event.data);
    if (event.data == 'fire') {
      handleFire();
    }

    if (event.data == 'asteroid') {
      handleGenerateAsteroid();
    }
  }

  // enable leap motion
  const leapMotion = new LeapMotion(({ x, y }) => {
    globals.mouse.coords.x = x * globals.viewport.width;

    let t = y * 600;
    // invert t to have the origin at the bottom left
    t = globals.viewport.height - t;

    globals.mouse.coords.y = t;
  });

  // enable mouse movement detection
  globals.engine.canvas.addEventListener("mousemove", function (event) {
    // globals.mouse.coords = getMouseCoords(event, globals.engine);
  });

  globals.engine.canvas.addEventListener("mouseleave", function (event) {
    // globals.mouse.coords.x = NaN;
    // globals.mouse.coords.y = NaN;
  });

  globals.engine.canvas.addEventListener("click", function (event) {
    handleFire();
  });

  // on keydown, if the key is space, fire
  window.addEventListener("keydown", function (event) {
    if (event.code === "KeyO") {
      // console.log('fire');
      // handleFire();
    }
    if (event.code === "KeyE") {
      // handleGenerateAsteroid();
    }
  });
};

const init = () => {
  globals.engine = new GameEngine("#game");
  globals.engine.start();
  initEvents();

  player = new Player(100, 100, 50, 50, 3, 0);
  player.draw();

  window.requestAnimationFrame(gameLoop);
};

function collides(a, b) {
  if (typeof a === "undefined" || typeof b === "undefined") {
    return false;
  }

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function checkBulletHits() {
  if (bullets.length > 0 && asteroids.length > 0) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      for (let k = asteroids.length - 1; k >= 0; k--) {
        if (collides(asteroids[k], bullets[j])) {
          console.log("collides");
          asteroids.splice(k, 1);
          bullets.splice(j, 1);
          player.counter += 5;
          // Player1.points += 1;
        }
      }
    }
  }
}

function checkAsteroidHits() {
  if (asteroids.length > 0) {
    for (let k = asteroids.length - 1; k >= 0; k--) {
      if (collides(asteroids[k], player)) {
        asteroids.splice(k, 1);
        player.counter -= 50;
        player.lives -= 1;
        console.log("- 1 vie !");
      }

      if (player.lives == 0) {
        console.log("Game Over");
        livesCounterElement.innerHTML = "Game over !";

        // clean();
        // init();
      }
    }
  }
}


const fpsCounterElement = document.querySelector(".fps-counter");
const pointsCounterElement = document.querySelector(".points-counter");
const livesCounterElement = document.querySelector(".lives-counter");


const gameLoop = (timeStamp) => {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  secondsPassed = Math.min(secondsPassed, 0.1);

  //Calculate fps
  fps = Math.round(1 / secondsPassed);
  fpsCounterElement.innerHTML = fps;

  pointsCounterElement.innerHTML = player.counter;
  livesCounterElement.innerHTML = player.lives;




  // process input

  // randomgeneration of asteroids every random seconds between 0.2 and 1sec
  if (Math.random() < 0.05) {
    handleGenerateAsteroid();
  }

  // update game
  player.update(secondsPassed);
  bullets.forEach((bullet) => bullet.update(secondsPassed));
  asteroids.forEach((asteroid) => asteroid.update(secondsPassed));

  // render
  updateCanvas();

  checkBulletHits();
  checkAsteroidHits();

  // clean
  clean();

  // call next frame
  window.requestAnimationFrame(gameLoop);
};

function clean() {
  // Remove bullets that are out of the canvas
  bullets = bullets.filter((bullet) => bullet.y > 0);
  asteroids = asteroids.filter((asteroid) => !(asteroid.y > globals.viewport.height));
}

function updateCanvas() {
  var ctx = globals.engine.context;

  // Clear the canvas
  ctx.clearRect(0, 0, globals.viewport.width, globals.viewport.height);

  player.draw();
  bullets.forEach((bullet) => bullet.draw());
  asteroids.forEach((asteroid) => asteroid.draw());
}

init();

// const position = {
//   x: 100,
//   y: 200,
//   z: 0,
//   id: 42,
// };

// const table = ["hello", "world", 42, { position }];

// const myFunction = ({ x: posX }) => {
//   console.log(posX);
// };

// myFunction(position);
