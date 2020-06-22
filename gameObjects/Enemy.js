import Circle from "../engine/gfx/shapes/Circle.js";
import { getDirectionFrom } from "../engine/GameMath.js";
import Projectile from "./Projectile.js";

export default class Enemy {
  alpha = 0;
  radius = 0.25;
  clickRadius = 0.4;
  health = 4;
  maxHealth = this.health;
  speed = 1/60;
  fireIn = 1;
  shouldDespawn = false;
  z = 40;

  constructor(engine, target, pos) {
    this.engine = engine;
    this.tileSet = this.engine.globals.tileSet;
    this.target = target;
    this.pos = pos;

    this.dir = getDirectionFrom(pos, target.center());
    this.xv = Math.cos(this.dir) * this.speed;
    this.yv = Math.sin(this.dir) * this.speed;

    this.body = new Circle(this.tileSet.viewportPos(this.pos), this.tileSet.camZoom * this.radius, {color: "#a33"});

    engine.onMouseDown(event => {
      if ( event.button === "left" ) {
        if ( this.tileSet.tilePos(event.pos).distanceTo(this.pos) <= this.clickRadius ) {
          this.health--;
          this.engine.sounds.play("shot");
          if ( this.health === 0 ) {
            engine.unregister(this);
          }
        }
      }
    });
  }

  damage(dmg) {
    this.health -= dmg;
    if ( this.health <= 0 ) {
      this.engine.unregister(this);
    }
  }

  despawn() {
    this.shouldDespawn = true;
  }

  center() {
    return this.pos;
  }

  update() {
    if ( this.shouldDespawn ) {
      this.alpha -= 1/60;
      if ( this.alpha < 0 ) {
        this.engine.unregister(this);
      }
    } else {
      this.alpha += 1/60;
      if ( this.alpha > 1 ) {
        this.alpha = 1;
      }
    }

    if ( this.pos.distanceToLessThan(this.target.center(), 3)) {
      this.fireIn -= 1/60;
      if ( this.fireIn < 0 ) {
        this.fireIn += 1;

        var enemyProjectile = new Projectile(this.engine, this.pos.copy(), this.target, 5);
        this.engine.register(enemyProjectile);
        this.engine.sounds.play("laser");
      }
    } else {
      this.pos.x += this.xv;
      this.pos.y += this.yv;
    }
  }

  draw(ctx) {
    this.body.pos = this.tileSet.viewportPos(this.pos);
    this.body.radius = this.tileSet.camZoom * 0.25;
    this.body.alpha = this.alpha;
    this.body.arc = this.health / this.maxHealth;
    
    this.body.draw(ctx);
  }
}