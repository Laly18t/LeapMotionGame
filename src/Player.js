import globals from "./globals";

export default class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 5;
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
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
