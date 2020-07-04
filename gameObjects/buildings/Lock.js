import Building from "./Building.js";

export default class Lock extends Building {
  constructor(engine, pos, orientation) {
    super(engine, pos, "lock", orientation);

    this.cam = engine.globals.cam;
    this.beakerImage = engine.images.get("beaker");

    this.inventory = {
      conveyor: {count: 4, icon: engine.images.get("conveyor"), cost: {blueRes: 40, redRes: 50}},
      miner: {count: 1, icon: engine.images.get("miner"), cost: {blueRes: 80}},
    };
  }

  onMouseClick() {
    this.engine.trigger("menuOn");
  }

  rotate() {

  }

  remove() {
    return false;
  }

}