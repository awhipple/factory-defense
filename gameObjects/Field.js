import TileSet from "../engine/gfx/Tileset.js";
import { Coord } from "../engine/GameMath.js";
import Enemy from "./Enemy.js";

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

    this.tileSet = new TileSet(engine, this.ground, {autoDrag: false});
    engine.globals.tileSet = this.tileSet;
    engine.register(this.tileSet);
  }

  update(engine) {
    if ( this.targetBuilding ) {
      this.enemyCountdown -= 1/60;
      if ( this.enemyCountdown < 0 ) {
        this.enemyCountdown += 1.5;

        var dir = Math.random() * 2 * Math.PI;
        var distance = Math.random() * 10 + 5;
        var enemy = new Enemy(engine, this.targetBuilding, 
          this.targetBuilding.pos.add(new Coord(Math.cos(dir) * distance, Math.sin(dir) * distance))
        );
        engine.register(enemy, "enemy");
      }
    }
  }

  getBuildingAt(pos) {
    return this.buildings[pos.x][pos.y];
  }

  setBuildingAt(building, pos = null) {
    // This method gets tricky because of new building sizes.
    // It needs to remove all buildings under tiles of the new building and
    // trigger updates on all the tiles of those underneath buildings as well.
    pos = pos || building?.pos;
    var buildSize = building?.size || "small";
    for ( var i = 0; i < Field.BUILDING_TILES[buildSize].length; i++ ) {
      var buildingPos = pos.add(Field.BUILDING_TILES[buildSize][i]);
      
      var oldBuilding = this.buildings[buildingPos.x][buildingPos.y];
      if (oldBuilding && (building || !oldBuilding.remove())) {
        return false;
      }
      for ( var k = 0; k < Field.BUILDING_TILES[oldBuilding?.size]?.length; k++) {
        var oldBuildingPos = oldBuilding.pos.add(Field.BUILDING_TILES[oldBuilding.size][k]);
        this.buildings[oldBuildingPos.x][oldBuildingPos.y] = null;
      }
      if ( oldBuilding ) {
        this.signalBuildingChange(oldBuilding.pos, oldBuilding.size);
      }
    }
    for ( var i = 0; i < Field.BUILDING_TILES[buildSize].length; i++ ) {
      var buildingPos = pos.add(Field.BUILDING_TILES[buildSize][i]);
      this.buildings[buildingPos.x][buildingPos.y] = building;
    }

    if ( building ) {
      this.signalBuildingChange(pos, building.size);
    }
    return true;
  }

  removeBuildingAt(pos) {
    this.setBuildingAt(null, pos);
  }

  signalBuildingChange(pos, size = "small") {
    Field.UPDATE_TILES[size].forEach(relativePos => {
      var neighbor = this.getBuildingAt(pos.add(relativePos));
      if ( neighbor && neighbor.onNeighborUpdate ) {
        neighbor.onNeighborUpdate();
      }
    });
  }

  startWave(targetBuilding) {
    this.targetBuilding = targetBuilding;
    this.enemyCountdown = 6;
  }

  endWave() {
    this.targetBuilding = null;
    this.engine.getObjects("enemy").forEach(enemy => {
      enemy.despawn()
    });
  }
}