import { Coord, NEXT_ORIENTATION, BoundingRect } from "../../engine/GameMath.js";
import Bar from "../../engine/gfx/ui/Bar.js";
import GameObject from "../../engine/objects/GameObject.js";

export const BUILDINGS = [
  "Conveyor",
  "Miner",
  "Unlocker",
  "Tower",
]

export default class Building extends GameObject{
  alpha = 1;
  on = true;
  size = "small";
  health = 100;
  healthMax = this.health;
  z = 30;

  _hover = false;
  
  resources = [];

  constructor(engine, pos, imgName, orientation = "right") {
    super(engine, {x: pos.x, y: pos.y, w: 1, h: 1});

    this.tilePos = pos.copy();

    this.cam = engine.globals.cam;
    this.field = engine.globals.field;
    this.tileSet = this.field.tileSet;
    this.img = engine.images.get(imgName).rotate(orientation);
    this.orientation = orientation;
    
    this.healthRect = new BoundingRect();
    this.healthBar = new Bar(this.healthRect, this.health, this.healthMax, { color: "#0f0" });
    
    this.moveTo(pos);

    engine.register(this);
  }

  onMouseClick(event) {
    if ( this.virtual ) {
      if ( event.button === "left" ) {
        this.build(this.tilePos);
        this.engine.trigger("buildingBuilt");
      }
      return false;
    }
    return true;
  }

  moveTo(pos) {
    this.tilePos = pos;
    this.pos = pos.add(Coord.half);

    this.tileRect = this.size === "small" ?
      new BoundingRect(pos.x, pos.y, 1, 1) :
      new BoundingRect(pos.x - 1, pos.y - 1, 3, 3);

    this.healthRect = new BoundingRect(this.tilePos.x + 0.1, this.tilePos.y - 0.9, 0.8, 0.1);
  }

  rotate(newOrientation = null) {
    this.orientation = newOrientation || NEXT_ORIENTATION[this.orientation];;
    for ( var i = 0; i < this.resources.length; i++ ) {
      var res = this.resources[i];
      res.moveTo(res.pos.rotateAround(this.pos));
    }
    this.img = this.img.rotate(newOrientation);
    this.field.signalBuildingChange(this.tilePos, this.size);
  }

  build(tile) {
    this.alpha = 1;
    this.on = true;
    this.virtual = false;
    if ( this.centerBuilding ) {
      this.centerBuilding.outerBuilding = this;
    }
    this.field.setBuildingAt(this, tile);
  }

  remove() {
    this.engine.unregister(this);
    this.removeResources();
    return true;
  }

  hover() {
    this._hover = true;
  }

  unHover() {
    this._hover = false;
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
    if (this.health <= 0 && this.health > -dmg) {
      var removeFrom = this.tilePos.copy();
      if ( this.size === "large" ) {
        removeFrom.addTo(Coord.right);
      }
      this.field.removeBuildingAt(removeFrom);
    }
    this.healthBar.setVal(this.health);
  }

  clone() {
    var newBuilding = new this.constructor(this.engine, this.tilePos.copy(), this.orientation);
    newBuilding.virtual = true;
    return newBuilding;
  }

  draw(ctx) {
    var drawArea = this.size === "large" ?
      this.cam.getScreenRect({x: this.tilePos.x - 1, y: this.tilePos.y - 1, w: 3, h: 3}) :
      this.cam.getScreenRect({x: this.tilePos.x, y: this.tilePos.y, w: 1, h: 1});
    this.img.draw(ctx, drawArea, {
      alpha: this.alpha,
    });
    if ( this.health < this.healthMax ) {
      this.healthBar.draw(ctx, this.cam.getScreenRect(this.healthRect));
    }
  }
}