import { Coord, NEXT_ORIENTATION, rotationMappings, numRotationsMap } from "../../engine/GameMath.js";
import Image from "../../engine/gfx/Image.js";

export const BUILDINGS = [
  "conveyor",
  "miner",
  "collector",
]

export default class Building {
  constructor(engine, x, y, img, orientation = "right") {
    this.engine = engine;
    this.field = engine.globals.field;
    this.pos = new Coord(x, y);
    this.image = new Image(img);
    this.orientation = orientation;
    this.alpha = 0.4;

    this.resources = [];

    this.on = false;
    this.z = 3;

    engine.register(this);
  }

  moveTo(pos) {
    this.pos = pos;
  }

  center() {
    return this.pos.add(Coord.half);
  }

  rotate(orientation) {
    var nextOrientation = orientation || NEXT_ORIENTATION[this.orientation];
    this.orientation = nextOrientation;
  }

  remove() {
    this.field.engine.unregister(this);
    for ( var i = 0; i < this.resources.length; i++ ) {
      this.field.engine.unregister(this.resources[i]);
    }
  }

  draw(ctx) {
    this.image.draw(ctx, this.field.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }

  get resource() {
    return this.resources[0];
  }

  set resource(res) {
    this.resources = [ res ];
  }
}