export default class Bar {
  constructor(rect, val, max, options = {}) {
    this.rect = rect;
    this.max = max;
    this.setVal(val);
    
    this.color = options.color || "#0f0";
    this.slide = options.slide || "left";
  }

  setVal(val) {
    this.val = val;
    
    this.fillAmount = this.val / this.max;
    if ( this.fillAmount < 0 ) {
      this.fillAmount = 0;
    } else if ( this.fillAmount > 1 ) {
      this.fillAmount = 1;
    }
  }

  draw(ctx, drawAt = null) {
    drawAt = drawAt || this.rect;

    ctx.fillStyle = this.color;
    ctx.fillRect(drawAt.x, drawAt.y, drawAt.w * this.fillAmount, drawAt.h);
    ctx.lineWidth = 1;
    ctx.strokeRect(drawAt.x, drawAt.y, drawAt.w, drawAt.h);    
  }
}