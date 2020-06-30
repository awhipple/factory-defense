import Circle from "../engine/gfx/shapes/Circle.js";
import { getDirectionFrom } from "../engine/GameMath.js";
import Projectile from "./Projectile.js";
import GameObject from "../engine/objects/GameObject.js";

export default class Enemy extends GameObject {
  alpha = 0;
  radius = 0.25;
  clickRadius = 0.4;
  speed = 1/60;
  fireIn = 1;
  shouldDespawn = false;
  z = 40;

  constructor(engine, target, pos, health) {
    super(engine, {x: pos.x, y: pos.y, radius: 0.25});

    this.cam = this.engine.globals.cam;

    this.target = target;
    this.maxHealth = this.health = health;

    this.dir = getDirectionFrom(pos, target.pos);
    this.xv = Math.cos(this.dir) * this.speed;
    this.yv = Math.sin(this.dir) * this.speed;

    this.body = new Circle(this.cam.getScreenPos(this.pos), this.cam.zoom * this.radius, {color: "#a33"});
  }

  onMouseClick(event) {
    if ( event.button === "left" ) {
      this.health--;
      this.engine.sounds.play("shot");
      if ( this.health === 0 ) {
        this.engine.unregister(this);
      }
    }
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

    if ( this.pos.distanceToLessThan(this.target.pos, 3)) {
      this.fireIn -= 1/60;
      if ( this.fireIn < 0 ) {
        this.fireIn += 1;

        var enemyProjectile = new Projectile(this.engine, this.pos.copy(), this.target, 5);
        this.engine.register(enemyProjectile);
        this.engine.sounds.play("laser");
      }
    } else {
      this.x += this.xv;
      this.y += this.yv;
    }
  }

  draw(ctx) {
    this.body.pos = this.cam.getScreenPos(this.pos);
    this.body.radius = this.cam.zoom * 0.25;
    this.body.alpha = this.alpha;
    this.body.arc = this.health / this.maxHealth;
    
    this.body.draw(ctx);
  }
}