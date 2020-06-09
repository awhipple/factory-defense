import { Coord, NEXT_ORIENTATION } from "../engine/GameMath.js";
import Image from "../engine/gfx/Image.js";

export const BUILDINGS = [
  "conveyor",
  "miner",
  "collector",
]

export default class Building {
  constructor(field, x, y, img, orientation = "right") {
    this.field = field;
    this.pos = new Coord(x, y);
    this.image = new Image(img);
    this.orientation = orientation;
    this.alpha = 0.4;

    this.on = false;
    this.z = 3;
  }

  rotate(orientation) {
    if ( orientation ) {
      this.orientation = orientation;
    } else {
      this.orientation = NEXT_ORIENTATION[this.orientation];
    }
  }

  draw(ctx) {
    this.image.draw(ctx, this.field.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }
}