import Building from "./Building.js";

export default class Lock extends Building {
  cost = 50;
  locked = true;

  constructor(engine, pos, orientation) {
    super(engine, pos, "lock", orientation);

    this.cam = engine.globals.cam;
    this.beakerImage = engine.images.get("beaker");

    this.inventory = {
      conveyor: {icon: this.engine.images.get("conveyor")},
      miner: {icon: this.engine.images.get("miner")}, 
      unlocker: {icon: this.engine.images.get("unlocker")}, 
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

  unlock() {
    this.locked = false;
    this.img = this.engine.images.get("tower");
    this.alpha = 0.4;
    this.engine.trigger("unlock");
  }

  draw(ctx) {
    super.draw(ctx);

    if ( !this.locked ) {
      var iconSize = 0.3 * this.cam.zoom;
      this.beakerImage.draw(ctx, this.cam.getScreenPos(this.pos), iconSize, iconSize, {center: true});
    }
  }
}