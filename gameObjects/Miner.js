import Building from "./Building.js";
import Resource from "./Resource.js";

export default class Miner extends Building {
  constructor(tileSet, x, y, cursorOrientation) {
    super(tileSet, x, y, tileSet.engine.images.get("miner"), cursorOrientation);

    this.spawnResource = 60;
  }

  update(engine) {
    if( this.on ) {
      this.spawnResource--;
      if ( 
        this.spawnResource <= 0 && 
        !this.resource && 
        this.tileSet.field[this.pos.x][this.pos.y].ground === "blueOre"
      ) {
        this.resource = new Resource(this.tileSet, this.pos.x+0.5, this.pos.y+0.5, engine.images.get("oreChunk"));
        engine.register(this.resource);
        this.spawnResource = 60;
      }
      if ( this.resource ) {
        this.resource.move(this.orientation, 1/60);
        if ( !this.pos.equals(this.resource.pos.floor()) ) {
          this.resource = null;
        }
      }
    }
  }
}