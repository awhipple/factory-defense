export const DIRECTIONS = [
  "left", "up", "right", "down",
];

export const NEXT_ORIENTATION = {
  left: "up",
  up: "right",
  right: "down",
  down: "left",
};

export class Coord {
  static unit = new Coord(1, 1);
  static left = new Coord(-1, 0);
  static right = new Coord(1, 0);
  static up = new Coord(0, -1);
  static down = new Coord(0, 1);
  static half = new Coord(0.5, 0.5);

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  within(rect) {
    return this.x > rect.x && this.x < rect.x + rect.w &&
           this.y > rect.y && this.y < rect.y + rect.h;
  }

  distanceTo(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
  
  distanceToLessThan(other, distance) {
    return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) < Math.pow(distance, 2);
  }

  directionTo(other) {
    if ( other.x > this.x ) {
      return "right";
    }
    if ( other.x < this.x ) {
      return "left";
    }
    if ( other.y < this.y ) {
      return "up";
    }
    return "down";
  }

  copy() {
    return new Coord(this.x, this.y);
  }

  add(other) {
    return new Coord(this.x + other.x, this.y + other.y);
  }

  addTo(other) {
    this.x += other.x;
    this.y += other.y;
  }

  subtract(other) {
    return new Coord(this.x - other.x, this.y - other.y);
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

  getDecimal() {
    return new Coord(this.x % 1, this.y % 1);
  }

  rotateAround(point) {
    var relative = this.subtract(point);
    var rotatedRelative = new Coord(-relative.y, relative.x);
    return point.add(rotatedRelative);
  }

  toString() {
    return this.x + ',' + this.y;
  }
}

export class BoundingRect {
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(x, y) {
    return (
      x >= this.x && x < this.x + this.w &&
      y >= this.y && y < this.y + this.h
    );
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

export const numRotationsMap = {
  "left-up": 1,
  "left-right": 2,
  "left-down": 3,
  "up-right": 1,
  "up-down": 2,
  "up-left": 3,
  "right-down": 1,
  "right-left": 2,
  "right-up": 3,
  "down-left": 1,
  "down-up": 2,
  "down-right": 3,
}

export const rotationMappings = [
  (pos) => new Coord(-pos.y, pos.x),
  (pos) => new Coord(-pos.x, -pos.y),
  (pos) => new Coord(pos.y, -pos.x),
];