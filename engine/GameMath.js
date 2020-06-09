export const NEXT_ORIENTATION = {
  left: "up",
  up: "right",
  right: "down",
  down: "left",
}

export class Coord {
  static left = new Coord(-1, 0);
  static right = new Coord(1, 0);
  static up = new Coord(0, -1);
  static down = new Coord(0, 1);

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Coord(this.x + other.x, this.y + other.y);
  }

  addTo(other) {
    this.x += other.x;
    this.y += other.y;
  }

  times(other) {
    return new Coord(this.x * other, this.y * other);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  floor() {
    return new Coord(Math.floor(this.x), Math.floor(this.y));
  }

  toString() {
    return this.x + ',' + this.y;
  }
}

export class BoundingRect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

export function getDirectionFrom(pointA, pointB) {
  var direction = Math.atan((pointB.y - pointA.y)/(pointB.x - pointA.x));
  if ( pointA.x > pointB.x ) {
    direction += Math.PI;
  }
  if ( direction < 0 ) {
    direction += Math.PI * 2;
  }
  return direction;
}