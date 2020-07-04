import Image from "./Image.js";

export default class Text {
  static _singleton = new Text('', 0, 0);

  alpha = 1;

  constructor(str, x, y, options = {}) {
    this.str = str;
    this.x = x;
    this.y = y;
    this.center = options.center;


    this.fontWeight = options.fontWeight ? options.fontWeight + ' ' : '';
    this.fontSize = options.fontSize ?? 50;
    this.fontStyle = options.fontStyle ?? "Arial";
    this.fontColor = options.fontColor ?? "#000";

    this._updateStyle();
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = this.style;
    var xShow = this.x - (this.center ? ctx.measureText(this.str).width/2 : 0);
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.str, xShow, this.y + this.fontSize);
    ctx.restore();
  }

  static draw(ctx, str, x, y, options = {}) {
    this._singleton.setText(str);
    this._singleton.x = x;
    this._singleton.y = y;
    this._singleton.fontSize = options.fontSize ?? 50;
    this._singleton.fontWeight = options.fontWeight ? options.fontWeight + ' ' : '';
    this._singleton.fontColor = options.fontColor ?? "#000";
    this._singleton.center = options.center ?? false;
    this._singleton._updateStyle();
    this._singleton.draw(ctx);
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

  _updateStyle() {
    this.style = this.fontWeight + this.fontSize + "px " + this.fontStyle;
  }

  _updateImage() {
    if ( this.textImage ) {
      var ctx = this.textImage.img.getContext("2d");
      ctx.clearRect(0, 0, 400, 400);
      this.draw(ctx);
    }
  }
}