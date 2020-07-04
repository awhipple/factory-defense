import Building from "./Building.js";
import Resource from "../Resource.js";
import { Coord } from "../../engine/GameMath.js";

export default class Miner extends Building {
  spawnRate = 60;
  spawnResource = this.spawnRate;
  feedsToConveyor = true;

  constructor(engine, pos, orientation) {
    super(engine, pos, "miner", orientation);
  }

  update(engine) {
    if ( this.on ) {
      this.spawnResource--;
      if ( 
        this.spawnResource <= 0 && 
        !this.resource && 
        this.field.ground[this.tilePos.x][this.tilePos.y] === "blueOre"
      ) {
        this.resource = new Resource(engine, this.x, this.y, engine.images.get("blueres"));
        engine.register(this.resource, "resource");
        this.spawnResource = this.spawnRate;
      }
      if ( this.resource ) {
        if ( this.tilePos.equals(this.resource.pos.floor()) ) {
          this.resource.move(this.orientation, 1/60);
        } else {
          var building = this.field.getBuildingAt(this.tilePos.add(Coord[this.orientation]));
          if ( building?.handOff?.(this.resource) ) {
            this.resource = null;
          }
        }
      }
    }
  }
}