import { Coord } from "../engine/GameMath.js";
import Image from "../engine/gfx/Image.js";

export const BUILDINGS = [
  "conveyor",
  "miner",
  "tower",
]

export default class Building {
  constructor(tileSet, x, y, img, orientation = "right") {
    this.tileSet = tileSet;
    this.pos = new Coord(x, y);
    this.image = new Image(img);
    this.orientation = orientation;
    this.alpha = 0.4;

    this.on = false;
    this.z = 3;
  }

  draw(ctx) {
    this.image.draw(ctx, this.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }
}