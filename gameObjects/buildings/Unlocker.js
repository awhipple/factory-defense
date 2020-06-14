import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";
import Lock from "./Lock.js";
import Text from "../../engine/gfx/Text.js";

export default class Unlocker extends Building {
  size = "large";
  centerBuilding = null;
  lockText = null;
  unlock = 50;

  constructor(engine, pos, orientation) {
    super(engine, pos, "unlocker", orientation);

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

  handOff(resource) {
    if ( this.collectionPoint.distanceTo(resource.pos) < 0.1 ) {
      this.engine.unregister(resource);
      if ( this.unlock > 0 ) {
        this.unlock -= 1;
      }
      this.text?.setText(this.unlock);
      return true;
    } else {
      return false;
    }
  }

  draw(ctx) {
    super.draw(ctx);
    this.textImage?.draw(ctx, this.field.tileSet.getTileRect(this.pos));
  }

  _updateCollectionPoint() {
    this.collectionPoint = this.center().add(Coord[this.orientation].times(1.5));
    
    this.centerBuilding = this.field.getBuildingAt(this.pos);
    this.text = this.text || this.centerBuilding instanceof Lock ? new Text(this.unlock) : null;
    this.textImage = this.text?.asImage(400, 400);
  }
}