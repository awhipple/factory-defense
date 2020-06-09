import { Coord } from "../engine/GameMath.js";
import Image from "../engine/gfx/Image.js";
import Resource from "./Resource.js";

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

    this.resources = [];
    this.spawnResource = 50;

    this.z = 1;
  }

  draw(ctx) {
    this.image.draw(ctx, this.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }

  update(engine) {
    this.spawnResource--;
    if ( this.spawnResource === 0 ) {
      var res = new Resource(this.tileSet, this.pos.x+0.5, this.pos.y+0.5, engine.images.get("oreChunk"));
      this.resources.push(res);
      engine.register(res);
      this.spawnResource = 50;
    }
  }
}