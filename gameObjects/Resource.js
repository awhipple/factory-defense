import { BoundingRect, Coord } from "../engine/GameMath.js";
import GameObject from "../engine/objects/GameObject.js";

export default class Resource extends GameObject {
  static collisionSize = 0.34;
  z = 20;

  constructor(engine, x, y) {
    super({x, y, radius: 0.2});

    this.engine = engine;
    this.cam = engine.globals.cam;
    this.pos = new Coord(x, y);
    this.img = engine.images.get("oreChunk")
  }

  move(coord, speed) {
    if ( typeof coord === "string" ) {
      coord = Coord[coord];
    }
    this.pos = this.pos.add(coord.times(speed));
  }

  moveTo(coord) {
    this.pos = coord;
  }

  draw(ctx) {
    this.img.draw(ctx, this.screenRect);
  }
  
}