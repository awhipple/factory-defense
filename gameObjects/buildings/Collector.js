import Building from "./Building.js";

export default class Collector extends Building {
  constructor(engine, x, y, orientation) {
    super(engine, x, y, engine.images.get("collector"), orientation);

    this.spawnResource = 60;
  }

  handOff(resource) {
    this.field.engine.unregister(resource);
    this.field.engine.blue++;
    return true;
  }
}