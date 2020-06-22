import Circle from "../engine/gfx/shapes/Circle.js";
import { getDirectionFrom, Coord } from "../engine/GameMath.js";

export default class Projectile {
  constructor(engine, pos, target, damage = 1) {
    this.engine = engine;
    this.tileSet = engine.globals.tileSet;
    this.pos = pos;
    this.target = target;
    this.damage = damage;

    this.dir = getDirectionFrom(this.pos, this.target.center());
    this.vector = new Coord(Math.cos(this.dir) * 1/3, Math.sin(this.dir) * 1/3);

    this.circle = new Circle(this.pos.copy(), 0, {color: "#00f"});
  }

  update(engine) {
    this.pos.addTo(this.vector);

    if ( this.pos.distanceToLessThan(this.target.center(), 0.25) ) {
      this.target.damage(this.damage);
      engine.unregister(this);
    }

    if ( !this.tileSet.within(this.pos) ) {
      this.engine.unregister(this);
    }
  }

  draw(ctx) {
    this.circle.pos.x = this.tileSet.viewportX(this.pos.x);
    this.circle.pos.y = this.tileSet.viewportY(this.pos.y);
    this.circle.radius = 0.05 * this.tileSet.camZoom;
    
    this.circle.draw(ctx);
  }
}