import Circle from "../engine/gfx/shapes/Circle.js";
import { getDirectionFrom, Coord } from "../engine/GameMath.js";

export default class Projectile {
  constructor(engine, pos, target) {
    this.engine = engine;
    this.tileSet = engine.globals.tileSet;
    this.pos = pos;
    this.target = target;

    this.dir = getDirectionFrom(this.pos, this.target.pos);
    this.vector = new Coord(Math.cos(this.dir) * 1/5, Math.sin(this.dir) * 1/5);

    this.circle = new Circle(this.pos.copy(), 0, {color: "#00f"});
  }

  update(engine) {
    this.pos.addTo(this.vector);

    if(this.pos.distanceFromLessThan(this.target.pos, 0.25)) {
      this.target.damage(1);
      engine.unregister(this);
    }
  }

  draw(ctx) {
    this.circle.pos.x = this.tileSet.viewportX(this.pos.x);
    this.circle.pos.y = this.tileSet.viewportY(this.pos.y);
    this.circle.radius = 0.05 * this.tileSet.camZoom;
    
    this.circle.draw(ctx);
  }
}