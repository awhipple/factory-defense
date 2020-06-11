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

  rotate() {
    var nextOrientation = NEXT_ORIENTATION[this.orientation];
    this.orientation = nextOrientation;
    for ( var i = 0; i < this.resources.length; i++ ) {
      var res = this.resources[i];
      res.moveTo(res.pos.rotateAround(this.center()));
    }
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
    if ( res ) {
      this.resources = [ res ];
    } else {
      this.resources = [];
    }
  }

  removeResources() {
    for ( var i = 0; i < this.resources.length; i++ ) {
      this.engine.unregister(this.resources[i]);
    }
  }
}