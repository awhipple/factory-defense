import Image from "../engine/gfx/Image.js";
import { BoundingRect, Coord } from "../engine/GameMath.js";

export default class Resource {
  constructor(engine, x, y, img) {
    this.engine = engine;
    this.tileSet = engine.globals.tileSet;
    this.pos = new Coord(x, y);
    this.img = new Image(img);

    this.z = 2;
  }

  move(coord, speed) {
    if ( typeof coord === "string" ) {
      coord = Coord[coord];
    }
    this.moveTo(this.pos.add(coord.times(speed)));
  }

  moveTo(coord) {
    var resources = this.engine.getObjects("resource");
    for ( var i = 0; i < resources.length; i++ ) {
      if ( this !== resources[i] && coord.distanceTo(resources[i].pos) < 0.2) {
        return;
      }
    }
    this.pos = coord;
  }

  draw(ctx) {
    var tileRect = new BoundingRect(this.pos.x - 0.2, this.pos.y - 0.2, 0.4, 0.4);
    var screenRect = this.tileSet.getScreenRect(tileRect);
    this.img.draw(ctx, screenRect);
  }

  update() {
     
  }
}