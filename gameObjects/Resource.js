import Image from "../engine/gfx/Image.js";
import { BoundingRect } from "../engine/GameMath.js";

export default class Resource {
  constructor(tileSet, x, y, img) {
    this.tileSet = tileSet;
    this.x = x;
    this.y = y;
    this.img = new Image(img);

    this.z = 2;
  }

  draw(ctx) {
    var tileRect = new BoundingRect(this.x - 0.2, this.y - 0.2, 0.4, 0.4);
    var screenRect = this.tileSet.getScreenRect(tileRect);
    this.img.draw(ctx, screenRect);
  }

  update() {
    this.x += 0.01; 
  }
}