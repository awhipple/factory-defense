export default class Circle {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius;
    this.color = options.color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }
}