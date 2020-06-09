import Image from "../engine/gfx/Image.js";
import { BoundingRect, Coord } from "../engine/GameMath.js";

export default class Resource {
  constructor(tileSet, x, y, img) {
    this.tileSet = tileSet;
    this.pos = new Coord(x, y);
    this.img = new Image(img);

    this.z = 2;
  }

  move(dir, speed) {
    switch(dir) {
      case "left":
        this.pos.x -= speed;
        break;
      case "right":
        this.pos.x += speed;
        break;
      case "up":
        this.pos.y -= speed;
        break;
      case "down":
        this.pos.y += speed;
        break;
    }
  }

  draw(ctx) {
    var tileRect = new BoundingRect(this.pos.x - 0.2, this.pos.y - 0.2, 0.4, 0.4);
    var screenRect = this.tileSet.getScreenRect(tileRect);
    this.img.draw(ctx, screenRect);
  }

  update() {
     
  }
}