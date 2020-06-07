import Sprite from '../engine/gfx/Sprite.js';
import { Circle } from '../engine/gfx/shapes/index.js';

export default class Ball {
  constructor(engine, x, y, xv, yv) {
    this.x = x || Math.random()*(engine.window.width-50)+25;
    this.y = y || Math.random()*(engine.window.height-50)+25;
    this.xv = xv || Math.random()*10-5;
    this.yv = yv || Math.random()*10-5;

    this.circle = new Circle({
      x: this.x, y: this.y,
      radius: 25,
      color: "#77f",
    });
    engine.register(this.circle);

    this.life = 30 * 60
  }

  remove(engine) {
    engine.unregister(this.circle);
  }

  update(engine) {
    this.x += this.xv;
    this.y += this.yv;

    this.yv += 0.1;

    if (
      (this.xv < 0 && this.x < 25) ||
      (this.xv > 0 && this.x > engine.window.width-25)
    ) {
      this.xv *= -1;
    }
    if (
      (this.yv < 0 && this.y < 25) ||
      (this.yv > 0 && this.y > engine.window.height-25)
    ) {
      this.yv *= -0.9;
    }

    this.circle.x = this.x;
    this.circle.y = this.y;

    this.life--;
  }
}