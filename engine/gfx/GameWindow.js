export default class GameWindow {
  constructor(engine, width, height, canvasId) {
    this.engine = engine;
    this.width = width;
    this.height = height;
    
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");

    this.objects = [];

    this.img = new Image();
    this.img.src = "./images/ball.png";

    requestAnimationFrame(() => this.draw());
  }

  register(object) {
    this.objects.push(object);
  }

  unregister(object) {
    var objectIndex = this.objects.indexOf(object);
    if ( objectIndex !== -1 ) {
      this.objects.splice(objectIndex, 1);
    }
  }

  draw() {
    requestAnimationFrame(() => this.draw());
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.width, this.height);
    for(var i = 0; i < this.objects.length; i++) {
      this.objects[i].draw(this.ctx, this.engine);
    }
    this.ctx.restore();
  }
}