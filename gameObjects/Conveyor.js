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
      if ( this.pos.equals(res.pos.floor()) ) {
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
}