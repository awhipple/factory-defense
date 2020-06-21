import Building from "./Building.js";
import Bar from "../../engine/gfx/ui/Bar.js";
import { BoundingRect, Coord } from "../../engine/GameMath.js";
import Projectile from "../Projectile.js";
import Circle from "../../engine/gfx/shapes/Circle.js";

export default class Tower extends Building {
  _ammo = 0;
  ammoMax = 6;
  fireRate = 0.2;
  fireIn = 0;
  range = 5;

  constructor(engine, pos, cursorOrientation) {
    super(engine, pos, "tower", cursorOrientation);

    this.tileSet = engine.globals.tileSet;

    this.ammoBar = new Bar(new BoundingRect(), this.ammo, this.ammoMax, { color: "#ff0" });
    this.ammoRect = new BoundingRect();

    this.rangeDisplay = new Circle(new Coord(0, 0), 0, {
      color: "#0f0",
      alpha: 0.1,
    });

    this.moveTo(this.pos);
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
      this.ammo += 1;
      this.ammo = Math.min(this.ammo, this.ammoMax);
      return true;
    } else {
      return false;
    }
  }

  update(engine) {
    this.fireIn = Math.max(this.fireIn - 1/60, 0);

    if ( this.fireIn === 0 ) {
      if ( !this.target ) {
        var enemies = engine.getObjects("enemy");
        for ( var i = 0; i < enemies.length; i++ ) {
          var enemy = enemies[i];
          
          if (this.ammo > 0 && this.center().distanceTo(enemy.pos) < this.range ) {
            this.fireIn += this.fireRate;
            
            var projectile = new Projectile(engine, this.center().copy(), enemy);
            engine.register(projectile);

            this.ammo--;
            this.engine.sounds.play("gunshot");
            break;
          }
        }
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);

    this.ammoBar.draw(ctx, this.tileSet.getScreenRect(this.ammoRect));

    if ( this._hover ) {
      this.rangeDisplay.pos = this.tileSet.viewportPos(this.center());
      this.rangeDisplay.radius = this.range * this.tileSet.camZoom;
      this.rangeDisplay.draw(ctx);
    }
  }

  get ammo() {
    return this._ammo;
  }

  set ammo(val) {
    this._ammo = val;
    this.ammoBar.setVal(this._ammo);
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