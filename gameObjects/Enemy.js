import Circle from "../engine/gfx/shapes/Circle.js";
import { getDirectionFrom } from "../engine/GameMath.js";

export default class Enemy {
  alpha = 0;
  radius = 0.25;
  health = 4;
  maxHealth = this.health;
  speed = 1/90;
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

    this.body = new Circle(this.tileSet.viewportPos(this.pos), this.tileSet.camZoom * this.radius, "#a33");

    engine.onMouseDown(event => {
      if ( event.button === "left" ) {
        if ( this.tileSet.tilePos(event.pos).distanceTo(this.pos) <= this.radius ) {
          this.health--;
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

    this.pos.x += this.xv;
    this.pos.y += this.yv;

    if ( !this.shouldDespawn && this.pos.within(this.target.tileRect) ) {
      this.target.damage(20);
      this.engine.unregister(this);
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