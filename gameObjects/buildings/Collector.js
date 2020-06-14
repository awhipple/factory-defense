import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";

export default class Collector extends Building {
  constructor(engine, pos, orientation) {
    super(engine, pos, "collector", orientation);

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
      this.engine.globals.blue++;
      return true;
    } else {
      return false;
    }
  }

  _updateCollectionPoint() {
    this.collectionPoint = this.center().add(Coord[this.orientation].times(0.5));
  }
}