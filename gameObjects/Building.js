import { Coord } from "../engine/GameMath.js";
import Image from "../engine/gfx/Image.js";
import Resource from "./Resource.js";

export const BUILDINGS = [
  "conveyor",
  "miner",
  "super",
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
  }

  draw(ctx) {
    this.image.draw(ctx, this.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }

  update() {
    this.spawnResource--;
    if ( this.spawnResource === 0 ) {
      var res = new Resource(this.tileSet, this.pos.x+0.5, this.pos.y+0.5, this.tileSet.engine.images.get("oreChunk"));
      this.resources.push(res);
      this.tileSet.engine.window.register(res, true);
      this.spawnResource = 50;
    }
    
    for(var i = 0; i < this.resources.length; i++) {
      this.resources[i].update();
    }
  }
}