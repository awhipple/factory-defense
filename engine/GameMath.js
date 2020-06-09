export class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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