import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";

export default class Conveyor extends Building {
  resources = [];
  z = 1;

  constructor(engine, x, y, orientation) {
    super(engine, x, y, engine.images.get("conveyor"), orientation);
    
    this.moveCoord = Coord[orientation];
  }

  rotate(orientation) {
    super.rotate(orientation);
    this.moveCoord = Coord[this.orientation];
  }

  handOff(resource) {
    if ( this.resources.length < 4 ) {
      this.resources.push(resource);
      return true;
    } else {
      return false;
    }
  }

  update() {
    for ( var i = 0; i < this.resources.length; i++ ) {
      var res = this.resources[i];
      if ( !this._inCenter(res) ) {
        var isHorizontal = this._isHorizontal();
        var checkPos = isHorizontal ? res.pos.y : res.pos.x;
        var slideDirection = checkPos % 1 < 0.5 ? 1 : -1;
        var slideVector = isHorizontal ? Coord.down : Coord.right;
        res.move(slideVector.times(slideDirection), 1/60);
        
        var newCheckPos = isHorizontal ? res.pos.y : res.pos.x;
        var newSlideDirection = newCheckPos % 1 < 0.5 ? 1 : -1;
        if ( newSlideDirection !== slideDirection ) {
          res.moveTo(res.pos.floor().add(Coord.half));
        }
      } else if ( this.pos.equals(res.pos.floor()) ) {
        res.move(this.moveCoord, 1/60);
      } else {
        var handoffBuilding = this.field.getBuildingAt(this.pos.add(Coord[this.orientation]));
        if ( handoffBuilding?.handOff?.(res) ) {
          this.resources.splice(i, 1);
          i--;
        }
      }
    }
  }

  _inCenter(res) {
    var coordVal = this._isHorizontal() ? res.pos.y : res.pos.x;
    return coordVal % 1 === 0.5;
  }

  _isHorizontal() {
    return this.orientation === "left" || this.orientation === "right";
  }
}