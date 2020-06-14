import Image from "./Image.js";

export default class Text {
  constructor(str, x, y, options = {}) {
    this.str = str;
    this.x = x;
    this.y = y;
    this.center = options.center;
    this.style = options.style;
  }

  draw(ctx) {
    ctx.font = this.style || "bold 200px Arial"
    var xShow = this.x - (this.center ? ctx.measureText(this.str).width/2 : 0);
    ctx.fillStyle = "#733";
    ctx.fillText(this.str, xShow, this.y);
  }

  setText(str) {
    this.str = str;

    this._updateImage();
  }

  asImage(width, height) {
    if ( !this.textImage ) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      this.draw(ctx);
      this.textImage = new Image(canvas);
    }

    return this.textImage;    
  }

  _updateImage() {
    if ( this.textImage ) {
      var ctx = this.textImage.img.getContext("2d");
      ctx.clearRect(0, 0, 400, 400);
      this.draw(ctx);
    }
  }
}