import TileSet from "../engine/gfx/Tileset.js";
import { DIRECTIONS, Coord } from "../engine/GameMath.js";

export default class Field {
  ground = [];
  buildings = [];

  constructor(engine, width, height) {
    this.engine = engine;
    this.width = width;
    this.height = height;

    for(var x = 0; x < width; x++) {
      this.ground[x] = [];
      this.buildings[x] = [];
      for(var y = 0; y < height; y++) {
        this.ground[x][y] = 'empty';
        this.buildings[x][y] = null;
      }
    }
    this.ground[49][49] = this.ground[48][50] = this.ground[49][50] = this.ground[50][50] = 'blueOre';

    this.tileSet = new TileSet(engine, this.ground);
    engine.globals.tileSet = this.tileSet;
    engine.register(this.tileSet);
  }

  getBuildingAt(pos) {
    return this.buildings[pos.x][pos.y];
  }

  setBuildingAt(pos, building) {
    var oldBuilding = this.buildings[pos.x][pos.y];
    if ( oldBuilding ) {
      this.engine.unregister(oldBuilding);
    }
    this.buildings[pos.x][pos.y] = building;

    this.signalBuildingChange(pos);
  }

  removeBuildingAt(pos) {
    var building = this.buildings[pos.x][pos.y];
    if ( building ) {
      building.remove();
      this.buildings[pos.x][pos.y] = null;
      this.signalBuildingChange(pos);
    }
  }

  signalBuildingChange(pos) {
    DIRECTIONS.forEach(dir => {
      var neighbor = this.getBuildingAt(pos.add(Coord[dir]));
      if ( neighbor && neighbor.onNeighborUpdate ) {
        neighbor.onNeighborUpdate();
      }
    });
  }
}