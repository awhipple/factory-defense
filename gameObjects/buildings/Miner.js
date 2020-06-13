import Building from "./Building.js";
import Resource from "../Resource.js";
import { Coord } from "../../engine/GameMath.js";

export default class Miner extends Building {
  spawnRate = 60;
  spawnResource = this.spawnRate;
  feedsToConveyor = true;

  constructor(engine, x, y, orientation) {
    super(engine, x, y, "miner", orientation);
  }

  update(engine) {
    if ( this.on ) {
      this.spawnResource--;
      if ( 
        this.spawnResource <= 0 && 
        !this.resource && 
        this.field.ground[this.pos.x][this.pos.y] === "blueOre"
      ) {
        this.resource = new Resource(engine, this.pos.x+0.5, this.pos.y+0.5, engine.images.get("oreChunk"));
        engine.register(this.resource, "resource");
        this.spawnResource = this.spawnRate;
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