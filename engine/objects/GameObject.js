import { BoundingRect, Coord } from "../GameMath.js";

export default class GameObject {
  constructor(engine, shape = {}) {
    this.engine = engine;
    
    this._pos = new Coord();

    if ( shape.radius ) {
      this._rect = new BoundingRect(
        shape.x - shape.radius, shape.y - shape.radius,
        2 * shape.radius, 2 * shape.radius
      );
      this.x = shape.x;
      this.y = shape.y;
    } else {
      this.rect = new BoundingRect(shape.x ?? 0, shape.y ?? 0, shape.w ?? 0, shape.h) ?? 0;
    }

    this.updateScreenRect();
  }

  updateScreenRect() {
    this.screenRect = this._cam ? this._cam.getScreenRect(this.rect) : this.rect;
  }

  draw(ctx, engine, color = "#00f") {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
    ctx.restore();
  }

  get x() {
    return this._pos.x;
  }

  set x(val) {
    this._pos.x = val;
    this._rect.x = this.x - this._rect.w / 2;
  }

  get y() {
    return this._pos.y;
  }

  set y(val) {
    this._pos.y = val;
    this._rect.y = this.y - this._rect.h / 2;
  }

  get pos() {
    return this._pos;
  }

  set pos(val) {
    this.x = val.x;
    this.y = val.y;
  }

  get rect() {
    return this._rect;
  }

  set rect(val) {
    this._rect = val;
    this._pos.x = val.x + val.w / 2;
    this._pos.y = val.y + val.h / 2;
  }

  get originX() {
    return this._rect.x;
  }

  set originX(val) {
    this.x = val + this._rect.w/2;
  }
  
  get originY() {
    return this._rect.y;
  }

  set originY(val) {
    this.y = val + this._rect.h/2;
  }

  get cam() {
    return this._cam;
  }

  set cam(cam) {
    this._cam = cam;
  }
}