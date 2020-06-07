export class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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