import Building from "./Building.js";
import Bar from "../../engine/gfx/ui/Bar.js";
import { BoundingRect, Coord } from "../../engine/GameMath.js";

export default class Tower extends Building {
  ammo = 0;
  ammoMax = 25;
  fireRate = 0.2;
  fireIn = 0;

  constructor(engine, pos, cursorOrientation) {
    super(engine, pos, "tower", cursorOrientation);

    this.ammoBar = new Bar(new BoundingRect(), this.ammo, this.ammoMax, { color: "#ff0" });
    this.ammoRect = new BoundingRect();
    this._updateAmmoRect();

    this._updateCollectionPoint();
  }

  moveTo(pos) {
    super.moveTo(pos);

    this._updateAmmoRect();
    this._updateCollectionPoint();
  }

  rotate(orientation) {
    super.rotate(orientation);

    this._updateCollectionPoint();
  }

  handOff(resource) {
    if ( this.ammo < this.ammoMax && this.collectionPoint.distanceTo(resource.pos) < 0.1 ) {
      this.engine.unregister(resource);
      this.ammo += 5;
      this.ammo = Math.min(this.ammo, this.ammoMax);
      this.ammoBar.setVal(this.ammo);
      return true;
    } else {
      return false;
    }
  }

  update(engine) {
    this.fireIn = Math.max(this.fireIn - 1/60, 0);

    if ( this.fireIn === 0 ) {
      var enemies = engine.getObjects("enemy");
      for ( var i = 0; i < enemies.length; i++ ) {
        var enemy = enemies[i];
        
        if ( this.pos.distanceTo(enemy.pos) < 5 ) {
          this.fireIn += this.fireRate;
               
        }
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);

    this.ammoBar.draw(ctx, this.engine.globals.tileSet.getScreenRect(this.ammoRect));
  }

  _updateAmmoRect() {
    if ( this.ammoRect ) {
      this.ammoRect.x = this.pos.x + 0.1;
      this.ammoRect.y = this.pos.y + 0.8;
      this.ammoRect.w = 0.8;
      this.ammoRect.h = 0.1;
    }
  }

  _updateCollectionPoint() {
    this.collectionPoint = this.center().add(Coord[this.orientation].times(0.5));
  }
}