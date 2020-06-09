import Building from "./Building.js";
import Resource from "./Resource.js";

export default class Conveyor extends Building {
  constructor(tileSet, x, y, cursorOrientation) {
    super(tileSet, x, y, tileSet.engine.images.get("conveyor"), cursorOrientation);

    this.z = 1;
  }
}