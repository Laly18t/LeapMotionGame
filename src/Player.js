import globals from "./globals";

export default class Player {
  constructor(x, y, width, height, lives, counter) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lives = lives;
    this.counter = counter;

    this.speed = 5;

    this.spaceShipImage = new Image();
    this.spaceShipImage.src = "spaceShip.png";
  }

  update(secondsPassed) {
    // if (globals.mouse.coords.x === NaN || globals.mouse.coords.y === NaN) {
    //   return;
    // }

    // const dx = globals.mouse.coords.x - this.x;
    // const dy = globals.mouse.coords.y - this.y;

    // const angle = Math.atan2(dy, dx);

    // this.x += Math.cos(angle) * this.speed;
    // this.y += Math.sin(angle) * this.speed;

    this.x = globals.mouse.coords.x - this.width / 2;
    this.y = globals.mouse.coords.y - this.height / 2;
  }

  draw() {
    const ctx = globals.engine.context;
    ctx.drawImage(this.spaceShipImage, this.x, this.y, this.width, this.height);
  }
}
