import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";

export default class Conveyor extends Building {
  constructor(engine, x, y, orientation) {
    super(engine, x, y, engine.images.get("conveyor"), orientation);
    
    this.resources = [];

    this.moveCoord = Coord[orientation].times(1/60);

    this.z = 1;
  }

  rotate(orientation) {
    Building.prototype.rotate.call(this, orientation);
    this.moveCoord = Coord[this.orientation].times(1/60);
  }

  handOff(resource) {
    if( this.resources.length < 3 ) {
      this.resources.push(resource);
      return true;
    } else {
      return false;
    }
  }

  update() {
    for ( var i = 0; i < this.resources.length; i++ ) {
      var res = this.resources[i];
      if ( !this.inCenter(res) ) {
        var isHorizontal = this.isHorizontal();
        var checkPos = isHorizontal ? res.pos.y : res.pos.x;
        var slideDirection = checkPos % 1 < 0.5 ? 1 : -1;
        var slideVector = isHorizontal ? new Coord(0, 1/60) : new Coord(1/60, 0);
        res.pos.addTo(slideVector.times(slideDirection));
        
        var newCheckPos = isHorizontal ? res.pos.y : res.pos.x;
        var newSlideDirection = newCheckPos % 1 < 0.5 ? 1 : -1;
        if ( newSlideDirection !== slideDirection ) {
          res.pos = res.pos.floor().add(Coord.half);
        }
      } else if ( this.pos.equals(res.pos.floor()) ) {
        this.resources[i].pos.addTo(this.moveCoord);
      } else {
        var handoffBuilding = this.field.getBuildingAt(this.pos.add(Coord[this.orientation]));
        if ( handoffBuilding?.handOff?.(res) ) {
          this.resources.splice(i, 1);
          i--;
        }
      }
    }
  }

  inCenter(res) {
    var coordVal = this.isHorizontal() ? res.pos.y : res.pos.x;
    return coordVal % 1 === 0.5;
  }

  isHorizontal() {
    return this.orientation === "left" || this.orientation === "right";
  }
}