import Image from "./Image.js";

export default class Text {
  constructor(str) {
    this.str = str;
  }

  draw(ctx) {
    ctx.font = "bold 200px Arial";
    ctx.fillStyle = "#733";
    ctx.fillText(this.str, 90, 260);
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