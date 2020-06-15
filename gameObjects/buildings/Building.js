import { Coord, NEXT_ORIENTATION, BoundingRect } from "../../engine/GameMath.js";
import Rectangle from "../../engine/gfx/shapes/Rectangle.js"

export const BUILDINGS = [
  "conveyor",
  "miner",
  "unlocker",
  "tower",
]

export default class Building {
  alpha = 0.4;
  resources = [];
  on = false;
  size = "small";
  z = 30;
  health = 100;
  maxHealth = this.health;

  constructor(engine, pos, imgName, orientation = "right") {
    this.engine = engine;
    this.field = engine.globals.field;
    this.pos = pos;
    this.img = engine.images.get(imgName).rotate(orientation);
    this.orientation = orientation;
    
    this.tileSpace = engine.globals.tile

    this.healthBar = new Rectangle(0, 0, 0, 0, "#0f0")

    this.moveTo(pos);

    engine.register(this);
  }

  moveTo(pos) {
    this.pos = pos;

    this.tileRect = this.size === "small" ?
      new BoundingRect(pos.x, pos.y, 1, 1) :
      new BoundingRect(pos.x - 1, pos.y - 1, 3, 3);

    this.healthBarRect = new BoundingRect(this.pos.x + 0.1, this.pos.y - 0.9, 0.8, 0.1);
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
    return true;
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

  damage(dmg) {
    this.health -= dmg;
    if (this.health <= 0) {
      this.field.removeBuildingAt(this.pos.add(Coord.right));
    }
  }

  draw(ctx) {
    var drawArea = this.size === "large" ?
      this.field.tileSet.getTileRect(this.pos.subtract(Coord.unit), this.pos.add(Coord.unit)) :
      this.field.tileSet.getTileRect(this.pos);
    this.img.draw(ctx, drawArea, {
      alpha: this.alpha,
    });
    if ( this.health < this.maxHealth ) {
      this.healthBar.rect = this.engine.globals.tileSet.getScreenRect(this.healthBarRect);
      this.healthBar.fill = this.health / this.maxHealth;
      this.healthBar.draw(ctx);
    }
  }
}