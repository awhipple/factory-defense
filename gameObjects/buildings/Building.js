import { Coord, NEXT_ORIENTATION } from "../../engine/GameMath.js";

export const BUILDINGS = [
  "conveyor",
  "miner",
  "unlocker",
]

export default class Building {
  alpha = 0.4;
  resources = [];
  on = false;
  size = "small";
  z = 3;

  constructor(engine, pos, imgName, orientation = "right") {
    this.engine = engine;
    this.field = engine.globals.field;
    this.pos = pos;
    this.img = engine.images.get(imgName).rotate(orientation);
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
    this.img = this.img.rotate();
    this.field.signalBuildingChange(this.pos, this.size);
  }

  remove() {
    this.engine.unregister(this);
    this.removeResources();
  }

  draw(ctx) {
    var drawArea = this.size === "large" ?
      this.field.tileSet.getTileRect(this.pos.subtract(Coord.unit), this.pos.add(Coord.unit)) :
      this.field.tileSet.getTileRect(this.pos);
    this.img.draw(ctx, drawArea, {
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

  handoff() {
    return false;
  }
}