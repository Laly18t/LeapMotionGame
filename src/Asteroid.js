import globals from "./globals";

export default class Asteroid {
  constructor(x, y, width, height, speed = 5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = speed;
  }

  update(secondsPassed) {
    this.y += this.speed;
  }

  draw() {
    const ctx = globals.engine.context;
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
