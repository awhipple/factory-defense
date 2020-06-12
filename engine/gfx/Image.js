import { NEXT_ORIENTATION } from "../GameMath.js";

export default class Image {
  static MIRROR_FLIP = {
    normal: "mirrored",
    mirrored: "normal",
  }

  constructor(img, orientation = "right", flip = "normal", orientationMap = null) {
    console.log(orientation, flip);
    this.img = img;
    this.orientation = orientation;
    this.flip = flip;
    this.orientationMap = orientationMap || { right: { normal: this } };
  }
  
  draw(ctx, rect, options = {}) {
    if ( options.alpha ) {
      ctx.globalAlpha = options.alpha;
    }
    ctx.drawImage(this.img, rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = 1;
  }

  rotate(targetOrientation = null) {
    targetOrientation = targetOrientation || NEXT_ORIENTATION[this.orientation];
    if ( this.orientationMap[targetOrientation]?.[this.flip] ) {
      return this.orientationMap[targetOrientation][this.flip];
    }

    var currentImage = this;
    while ( currentImage.orientation !== targetOrientation ) {
      var newCanvas = currentImage._rotateImage();
      var newOrientation = NEXT_ORIENTATION[currentImage.orientation];
      currentImage = new Image(newCanvas, newOrientation, currentImage.flip, this.orientationMap);
      this.orientationMap[newOrientation] = this.orientationMap[newOrientation] || {};
      this.orientationMap[newOrientation][this.flip] = currentImage;
    }
    return currentImage;
  }

  mirror() {
    var flipTo = Image.MIRROR_FLIP[this.flip];
    if ( this.orientationMap[this.orientation][flipTo] ) {
      return this.orientationMap[this.orientation][flipTo];
    }

    var flippedImage = new Image(this._mirrorImage(), this.orientation, flipTo, this.orientationMap);
    this.orientationMap[this.orientation][flipTo] = flippedImage;
    return flippedImage;
  }

  _rotateImage() {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = this.img.width;
    newCanvas.height = this.img.height;
    var newCtx = newCanvas.getContext("2d");

    newCtx.save();
    newCtx.fillStyle = "#fff";
    newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
    newCtx.translate(newCanvas.width/2, newCanvas.height/2);
    newCtx.rotate(Math.PI/2);
    newCtx.drawImage(this.img, -(newCanvas.width/2), -(newCanvas.height/2));
    newCtx.restore();

    return newCanvas;
  }

  _mirrorImage() {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = this.img.width;
    newCanvas.height = this.img.height;
    var newCtx = newCanvas.getContext("2d");

    newCtx.save();
    newCtx.fillStyle = "#fff";
    newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
    if ( this.orientation === "up" || this.orientation === "down" ) {
      newCtx.translate(this.img.width, 0);
      newCtx.scale(-1, 1);
    } else {
      newCtx.translate(0, this.img.height);
      newCtx.scale(1, -1);
    }
    newCtx.drawImage(this.img, 0, 0);
    newCtx.restore();

    return newCanvas;
  }

}