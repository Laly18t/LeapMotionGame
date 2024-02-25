import globals from "./globals";

export default class GameEngine {
  constructor(canvasID) {
    this.canvas = document.querySelector(canvasID)

    this.backgroundImage = new Image();
    this.backgroundImage.src = "space.png";
  }

  start() {
    this.canvas.width = globals.viewport.width;
    this.canvas.height = globals.viewport.height;
    this.context = this.canvas.getContext('2d');

    this.boundingRect = this.canvas.getBoundingClientRect(),
    this.scaleX = this.canvas.width / this.boundingRect.width,    // relationship bitmap vs. element for x
    this.scaleY = this.canvas.height / this.boundingRect.height; 
  }

  loop() {
    this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
  }
}