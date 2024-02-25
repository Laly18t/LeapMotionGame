import globals from "./globals";

export default class Bullet {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 5;
  }

  update(secondsPassed) {
    this.y -= this.speed;
  }

  draw() {
    const ctx = globals.engine.context;
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
