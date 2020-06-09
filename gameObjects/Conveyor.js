import Building from "./Building.js";
import { Coord } from "../engine/GameMath.js";

export default class Conveyor extends Building {
  constructor(field, x, y, orientation) {
    super(field, x, y, field.engine.images.get("conveyor"), orientation);
    
    this.resources = [];

    this.moveCoord = Coord[orientation].times(1/60);

    this.z = 1;
  }

  rotate(orientation) {
    Building.prototype.rotate.call(this, orientation);
    this.moveCoord = Coord[this.orientation].times(1/60);
  }

  handOff(resource) {
    this.resources.push(resource);
    return true;
  }

  update() {
    for ( var i = 0; i < this.resources.length; i++ ) {
      var res = this.resources[i];
      if ( !this.inCenter(res) ) {
        if ( this.isHorizontal() ) {
          if ( res.pos.y % 1 < 0.5 ) {
            res.pos.y += 1/60;
            if ( res.pos.y % 1 > 0.5 ) {
              res.pos.y = Math.floor(res.pos.y) + 0.5;
            }
          } else {
            res.pos.y -= 1/60;
            if ( res.pos.y % 1 < 0.5 ) {
              res.pos.y = Math.floor(res.pos.y) + 0.5;          
            }
          }
        } else {
          if ( res.pos.x % 1 < 0.5 ) {
            res.pos.x += 1/60;
            if ( res.pos.x % 1 > 0.5 ) {
              res.pos.x = Math.floor(res.pos.x) + 0.5;
            }
          } else {
            res.pos.x -= 1/60;
            if ( res.pos.x % 1 < 0.5 ) {
              res.pos.x = Math.floor(res.pos.x) + 0.5;
            }
          }
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