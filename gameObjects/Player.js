import Sprite from "../engine/gfx/Sprite.js";
import { getDirectionFrom, Coord } from "../engine/GameMath.js";
import Ball from "./Ball.js";

export default class Player {
  constructor(engine) {
    this.pos = new Coord(
      engine.window.width / 2,
      engine.window.height / 2,
    );

    this.sprite = new Sprite(engine.images.get('player'), this.pos.x, this.pos.y, 0.3);
    engine.register(this.sprite);

    this.balls = [];

    engine.onKeyDown(event => {
      switch(event.key) {
        case "a":
          this.pos.x -= 10;
          break;
        case "d":
          this.pos.x += 10;
          break;
        case "w":
          this.pos.y -= 10;
          break;
        case "s":
          this.pos.y += 10;
          break;
      };

      if ( ["a", "d", "w", "s"].includes(event.key)) {
        this.sprite.rad = getDirectionFrom(this.pos, engine.mousePos);
      }
    });

    engine.onMouseMove(event => {
      this.sprite.rad = getDirectionFrom(this.pos, event.pos);
    });

    engine.onMouseClick(event => {
      if ( event.button == 'left' ) {
        var xDir = Math.cos(this.sprite.rad), yDir = Math.sin(this.sprite.rad);
        this.balls.push(new Ball(engine, this.pos.x + xDir * 75, this.pos.y + yDir * 75, xDir * 10, yDir * 10));
      }
    });
  }

  update(engine) {
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;

    for(var i = 0; i < this.balls.length; i++) {
      this.balls[i].update(engine);
    }

    var i = this.balls.length;
    while(i--) {
      if(this.balls[i].life < 0) {
        this.balls[i].remove(engine);
        this.balls.splice(i, 1);
      }
    }
  }
}