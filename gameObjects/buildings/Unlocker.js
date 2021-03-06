import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";
import Lock from "./Lock.js";
import Text from "../../engine/gfx/Text.js";

export default class Unlocker extends Building {
  size = "large";
  centerBuilding = null;
  lockText = null;
  startWave = false;

  constructor(engine, pos, orientation) {
    super(engine, pos, "unlocker", orientation);
    
    // Annoying bug causes building rect to initialize as small until we "move" it.
    this.moveTo(pos);

    this._updateCollectionPoint();
  }

  moveTo(pos) {
    super.moveTo(pos);
    this._updateCollectionPoint();
  }

  rotate(orientation) {
    super.rotate(orientation);
    this._updateCollectionPoint();
  }

  remove() {
    super.remove();
    this.field.endWave();
    return true;
  }

  handOff(resource) {
    if ( 
      this.unlockCost && this.unlockCost > 0 && 
      this.collectionPoint.distanceTo(resource.pos) < 0.1 &&
      this.unlockTarget 
    ) {
      this.engine.unregister(resource);
      this.unlockCost -= 1;
      this.text?.setText(this.unlockCost);
      if ( this.startWave ) {
        this.engine.globals.alert.activate(6);
        this.field.startWave(this);
        this.startWave = false;
      }
      if ( this.unlockCost === 0 ) {
        this.field.endWave();
      }
      return true;
    } else {
      return false;
    }
  }

  draw(ctx) {
    super.draw(ctx);

    if ( this.unlockCost > 0 ) {
      this.textImage?.draw(ctx, this.screenRect);
    }
  }

  getProgress() {
    return [
      {
        icon: this.engine.images.get("blueres"),
        val: 50 - this.unlockCost,
        max: 50,
        color: "#77c",
      },
    ];
  }

  getLockInventoryLessBuildQueue() {
    return this.centerBuilding.inventory;
  }

  setUnlock(type) {
    this.unlockTarget = this.centerBuilding.inventory[type];
    this.unlockCost = 50;
    this.startWave = true;
  }

  _updateCollectionPoint() {
    this.collectionPoint = this.pos.add(Coord[this.orientation].times(1.5));
    
    this.centerBuilding = this.field.getBuildingAt(this.tilePos);
    if ( this.centerBuilding instanceof Lock && this.centerBuilding.locked) {
      this.unlockCost = this.unlockCost || this.centerBuilding.cost;
      this.text = this.text || new Text(this.unlockCost, 200, 140, { center: true, fontWeight: "bold", fontSize: 200, fontColor: "#733" });
      this.textImage = this.text.asImage(400, 400);
      this.startWave = true;
    } else {
      this.unlockCost = null;
      this.text = null;
      this.textImage = null;
      this.startWave = false;
    }
  }
}