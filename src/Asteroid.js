import globals from "./globals";
export default class Asteroid {
  constructor(x, y, width, height, speed = 5, imageSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = speed;

    console.log("vitesse", speed);

    // initialisation de l'image

    //choisir une image au hasard
    const randomIndex = Math.floor(Math.random() * imageSrc.length);
    this.asteroidImage = new Image();
    this.asteroidImage.src = imageSrc[randomIndex];
  }

  update(secondsPassed) {
    this.y += this.speed;
  
  }

  draw() {
    const ctx = globals.engine.context;

    

    //dessiner une image
    ctx.drawImage(this.asteroidImage, this.x, this.y, this.width, this.height);
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
