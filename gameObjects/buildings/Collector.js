import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";

export default class Collector extends Building {
  constructor(engine, x, y, orientation) {
    super(engine, x, y, engine.images.get("collector"), orientation);

    this.updateCollectionPoint();
  }

  moveTo(pos) {
    super.moveTo(pos);
    this.updateCollectionPoint();
  }

  rotate(orientation) {
    super.rotate(orientation);
    this.updateCollectionPoint();
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

  updateCollectionPoint() {
    this.collectionPoint = this.center().add(Coord[this.orientation].times(0.5));
  }
}