import Building from "./Building.js";

export default class Lock extends Building {
  cost = 50;

  constructor(engine, pos, orientation) {
    super(engine, pos, "lock", orientation);
  }

  rotate() {

  }

  remove() {
    return false;
  }
}