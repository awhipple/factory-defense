import Building from "./Building.js";
import Resource from "./Resource.js";
import { Coord } from "../engine/GameMath.js";

export default class Miner extends Building {
  constructor(field, x, y, orientation) {
    super(field, x, y, field.engine.images.get("miner"), orientation);

    this.spawnResource = 60;
  }

  update(engine) {
    if( this.on ) {
      this.spawnResource--;
      if ( 
        this.spawnResource <= 0 && 
        !this.resource && 
        this.field.field[this.pos.x][this.pos.y].ground === "blueOre"
      ) {
        this.resource = new Resource(this.field.tileSet, this.pos.x+0.5, this.pos.y+0.5, engine.images.get("oreChunk"));
        engine.register(this.resource);
        this.spawnResource = 60;
      }
      if ( this.resource ) {
        if ( this.pos.equals(this.resource.pos.floor()) ) {
          this.resource.move(this.orientation, 1/60);
        } else {
          var building = this.field.getBuildingAt(this.pos.add(Coord[this.orientation]));
          if ( building?.handOff?.(this.resource) ) {
            this.resource = null;
          }
        }
      }
    }
  }
}