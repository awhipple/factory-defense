import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";

export default class Collector extends Building {
  constructor(engine, x, y, orientation) {
    super(engine, x, y, engine.images.get("collector"), orientation);

    this.spawnResource = 60;

    this.updateCollectionPoint();
  }

  moveTo(pos) {
    Building.prototype.moveTo.call(this, pos);
    this.updateCollectionPoint();
  }

  rotate(orientation) {
    Building.prototype.rotate.call(this, orientation);
    this.updateCollectionPoint();
  }

  handOff(resource) {
    if ( this.collectionPoint.distanceTo(resource.pos) < 0.1 ) {
      this.field.engine.unregister(resource);
      this.field.engine.globals.blue++;
      return true;
    } else {
      return false;
    }
  }

  updateCollectionPoint() {
    this.collectionPoint = this.center().add(Coord[this.orientation].times(0.5));
  }
}