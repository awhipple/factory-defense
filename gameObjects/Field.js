import TileSet from "../engine/gfx/Tileset.js";
import { DIRECTIONS, Coord } from "../engine/GameMath.js";

export default class Field {
  static BUILDING_TILES = {
    small: [
      new Coord(0, 0),
    ],
    large: [
      new Coord(-1, -1),
      new Coord( 0, -1),
      new Coord( 1, -1),
      new Coord(-1,  0),
      new Coord( 1,  0),
      new Coord(-1,  1),
      new Coord( 0,  1),
      new Coord( 1,  1),
    ]
  }

  static UPDATE_TILES = {
    small: [
      new Coord( 0, -1),
      new Coord(-1,  0),
      new Coord( 1,  0),
      new Coord( 0,  1),
    ],
    large: [
      new Coord(-1, -2),
      new Coord( 0, -2),
      new Coord( 1, -2),
      new Coord(-2, -1),
      new Coord( 2, -1),
      new Coord(-2,  0),
      new Coord( 0,  0),
      new Coord( 2,  0),
      new Coord(-2,  1),
      new Coord( 2,  1),
      new Coord(-1,  2),
      new Coord( 0,  2),
      new Coord( 1,  2),
    ]
  }

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
    // This method gets tricky because of new building sizes.
    // It needs to remove all buildings under tiles of the new building and
    // trigger updates on all the tiles of those underneath buildings as well.
    var buildSize = building?.size || "small";
    for ( var i = 0; i < Field.BUILDING_TILES[buildSize].length; i++ ) {
      var buildingPos = pos.add(Field.BUILDING_TILES[buildSize][i]);
      
      var oldBuilding = this.buildings[buildingPos.x][buildingPos.y];
      if (oldBuilding && !oldBuilding.remove()) {
        return false;
      }
      for ( var k = 0; k < Field.BUILDING_TILES[oldBuilding?.size]?.length; k++) {
        var oldBuildingPos = oldBuilding.pos.add(Field.BUILDING_TILES[oldBuilding.size][k]);
        this.buildings[oldBuildingPos.x][oldBuildingPos.y] = null;
      }
      if ( oldBuilding ) {
        this.signalBuildingChange(oldBuilding.pos, oldBuilding.size);
      }

      this.buildings[buildingPos.x][buildingPos.y] = building;
    }

    if ( building ) {
      this.signalBuildingChange(pos, building.size);
    }
    return true;
  }

  removeBuildingAt(pos) {
    this.setBuildingAt(pos, null);
  }

  signalBuildingChange(pos, size = "small") {
    Field.UPDATE_TILES[size].forEach(relativePos => {
      var neighbor = this.getBuildingAt(pos.add(relativePos));
      if ( neighbor && neighbor.onNeighborUpdate ) {
        neighbor.onNeighborUpdate();
      }
    });
  }
}