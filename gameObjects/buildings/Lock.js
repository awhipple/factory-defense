import Building from "./Building.js";

export default class Lock extends Building {
  cost = 50;
  locked = true;

  constructor(engine, pos, orientation) {
    super(engine, pos, "lock", orientation);

    this.beakerImage = engine.images.get("beaker");

    engine.onMouseDown(event => {
      if ( this.tileSet.tilePos(event.pos).floor().equals(this.pos) && !this.locked) {
        this.engine.globals.alert.activate(3);
        this.field.startWave(this);
      }
    });
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
      var iconSize = 0.3 * this.tileSet.camZoom;
      this.beakerImage.draw(ctx, this.tileSet.viewportPos(this.center()), iconSize, iconSize, {center: true});
    }
  }
}