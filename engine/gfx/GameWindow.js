export default class GameWindow {
  objects = [];

  constructor(engine, width, height, canvasId) {
    this.engine = engine;
    this.width = width;
    this.height = height;
    
    this.canvas = document.getElementById(canvasId);
    this.canvas.oncontextmenu = () => false;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");

    requestAnimationFrame(() => this.draw());
  }

  // To Do: Implement z index for draw order
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
    this.objects.sort((a, b) => (a.z || 0) - (b.z || 0))
    for(var i = 0; i < this.objects.length; i++) {
      this.objects[i].draw(this.ctx, this.engine);
    }
    this.ctx.restore();
  }
}