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
    if ( this.unlockCost && this.unlockCost > 0 && this.collectionPoint.distanceTo(resource.pos) < 0.1 ) {
      this.engine.unregister(resource);
      this.unlockCost -= 1;
      this.text?.setText(this.unlockCost);
      if ( this.startWave ) {
        this.engine.globals.alert.activate(6);
        this.field.startWave(this);
        this.startWave = false;
      }
      if ( this.unlockCost === 0 ) {
        this.lock?.unlock();
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
      this.textImage?.draw(ctx, this.cam.getScreenRect({x: this.pos.x, y: this.pos.y, w: 1, h: 1}));
    }
  }

  _updateCollectionPoint() {
    this.collectionPoint = this.center().add(Coord[this.orientation].times(1.5));
    
    this.centerBuilding = this.field.getBuildingAt(this.pos);
    if ( this.centerBuilding instanceof Lock && this.centerBuilding.locked) {
      this.lock = this.centerBuilding;
      this.unlockCost = this.unlockCost || this.centerBuilding.cost;
      this.text = this.text || new Text(this.unlockCost, 200, 340, { center: true });
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