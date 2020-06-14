import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";

export default class Lock extends Building {
  constructor(engine, pos, orientation) {
    super(engine, pos, "lock", orientation);
  }
}