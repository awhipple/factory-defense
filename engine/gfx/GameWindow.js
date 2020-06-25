export default class GameWindow {
  constructor(engine, canvasId, gameObjects) {
    this.engine = engine;
    this.objects = gameObjects;
    
    this.canvas = document.getElementById(canvasId);
    this.canvas.oncontextmenu = () => false;
    this.canvas.style = "width: 100%; height: 100%;"
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");

    requestAnimationFrame(() => this.draw());
  }

  draw() {
    requestAnimationFrame(() => this.draw());
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects.sort((a, b) => (a.z || 0) - (b.z || 0))
    for(var i = 0; i < this.objects.length; i++) {
      if ( !this.objects[i].hide ) {
        this.objects[i].updateScreenRect?.();
        this.objects[i].draw?.(this.ctx, this.engine);
      }
    }
    this.ctx.restore();
  }
}