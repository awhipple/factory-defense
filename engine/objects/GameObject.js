import { BoundingRect } from "../GameMath.js";

export default class GameObject {
  constructor(rect) {
    this.rect = new BoundingRect(rect.x, rect.y, rect.w, rect.h);
    this.r = Math.floor(Math.random()*100);

    this.updateScreenRect();
  }

  setCam(cam) {
    this._cam = cam;
  }

  updateScreenRect() {
    this.screenRect = this._cam ? this._cam.getScreenRect(this.rect) : this.rect;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#00f";
    ctx.fillRect(this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
    ctx.restore();
  }
}