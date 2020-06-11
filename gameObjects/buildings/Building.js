import { Coord, NEXT_ORIENTATION } from "../../engine/GameMath.js";
import Image from "../../engine/gfx/Image.js";

export const BUILDINGS = [
  "conveyor",
  "miner",
  "collector",
]

export default class Building {
  alpha = 0.4;
  resources = [];
  on = false;
  z = 3;

  constructor(engine, x, y, img, orientation = "right") {
    this.engine = engine;
    this.field = engine.globals.field;
    this.pos = new Coord(x, y);
    this.img = new Image(img);
    this.orientation = orientation;

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
    this.engine.unregister(this);
    this.removeResources();
  }

  draw(ctx) {
    this.img.draw(ctx, this.field.tileSet.getTileBoundingRect(this.pos), {
      orientation: this.orientation,
      alpha: this.alpha,
    });
  }

  get resource() {
    return this.resources?.[0];
  }

  set resource(res) {
    this.resources = [ res ];
  }

  removeResources() {
    for ( var i = 0; i < this.resources.length; i++ ) {
      this.engine.unregister(this.resources[i]);
    }
  }
}