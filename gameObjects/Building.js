import { Coord } from "../engine/GameMath.js";
import Image from "../engine/gfx/Image.js";

export default class Building {
  constructor(x, y, img, orientation = "right") {
    this.pos = new Coord(x, y);
    this.image = new Image(img);
    this.orientation = orientation;
  }
}