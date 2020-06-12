import { BoundingRect, Coord } from "../engine/GameMath.js";

export default class Resource {
  static collisionSize = 0.2;
  z = 2;

  constructor(engine, x, y) {
    this.engine = engine;
    this.tileSet = engine.globals.tileSet;
    this.pos = new Coord(x, y);
    this.img = engine.images.get("oreChunk")
  }

  move(coord, speed) {
    if ( typeof coord === "string" ) {
      coord = Coord[coord];
    }
    this.moveTo(this.pos.add(coord.times(speed)));
  }

  moveTo(coord) {
    this.pos = coord;
  }

  draw(ctx) {
    var tileRect = new BoundingRect(this.pos.x - 0.2, this.pos.y - 0.2, 0.4, 0.4);
    var screenRect = this.tileSet.getScreenRect(tileRect);
    this.img.draw(ctx, screenRect);
  }
  
}