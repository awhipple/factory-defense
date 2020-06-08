export default class Image {
  constructor(img) {
    this.img = img;
    this.imageDirections = {
      right: this.img,
    }
  }
  
  draw(ctx, x, y, w, h, options = {}) {
    if ( options.alpha ) {
      ctx.globalAlpha = options.alpha;
    }
    ctx.drawImage(this.getImage(options.orientation), x, y, w, h);
    ctx.globalAlpha = 1;
  }
  
  getImage(dir = "right") {
    if (!this.imageDirections[dir]) {
      this.generateRotations();
    }
    return this.imageDirections[dir];
  }

  generateRotations() {
    [[Math.PI/2, "down"], [Math.PI, "left"], [3*Math.PI/2, "up"]].forEach((dir) => {
      var newImg = document.createElement("canvas");
      newImg.width = this.img.width;
      newImg.height = this.img.height;
      var newCtx = newImg.getContext("2d");

      newCtx.save();
      newCtx.fillStyle = "#fff";
      newCtx.clearRect(0, 0, newImg.width, newImg.height);
      newCtx.translate(newImg.width/2, newImg.height/2);
      newCtx.rotate(dir[0]);
      newCtx.drawImage(this.img, -(newImg.width/2), -(newImg.height/2));
      newCtx.restore();

      this.imageDirections[dir[1]] = newImg;
    });
  }
}