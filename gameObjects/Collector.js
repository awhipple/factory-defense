import Building from "./Building.js";

export default class Collector extends Building {
  constructor(field, x, y, orientation) {
    super(field, x, y, field.engine.images.get("collector"), orientation);

    this.spawnResource = 60;
  }

  handOff(resource) {
    this.field.engine.unregister(resource);
    this.field.engine.blue++;
    return true;
  }
}