import { Coord } from "../engine/GameMath.js";
import Image from "../engine/gfx/Image.js";

export default class Building {
  constructor(tileSet, x, y, img, orientation = "right") {
    this.tileSet = tileSet;
    this.pos = new Coord(x, y);
    this.image = new Image(img);
    this.orientation = orientation;
    this.alpha = 0.4;
  }

  draw(ctx) {
    this.image.draw(ctx, this.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }
}