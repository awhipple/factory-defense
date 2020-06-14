export default class Circle {
  alpha = 1;
  arc = 1;
  
  constructor(pos, radius, color) {
    this.pos = pos;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    if ( this.arc < 1 ) {
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, this.arc * Math.PI * 2, false);
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.lineWidth = 0;
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
      ctx.lineWidth = 1;
    } else {
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
      ctx.lineWidth = 1;
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.restore();
  }
}