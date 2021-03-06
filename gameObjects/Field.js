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
  buildingCount = {Conveyor: 0, Miner: 0, Unlocker: 0, Tower: 0};
  buildingMax = {Conveyor: 16, Miner: 4, Unlocker: 1, Tower: 2};

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

    // Does this need to be updated?
    var tileSetOnclick = this.tileSet.onClick;
    this.tileSet.onClick = (event) => {
      tileSetOnclick.call(this.tileSet, event);
      this.engine.trigger("fieldClick");
    }
  }

  update(engine) {
    if ( this.targetBuilding ) {
      this.enemyCountdown -= 1/60;
      if ( this.enemyCountdown < 0 ) {
        this.enemyCountdown += 1.5;
        this.enemyCount++;

        var dir = Math.random() * 2 * Math.PI;
        var distance = Math.random() * 10 + 10;
        var enemy = new Enemy(engine, this.targetBuilding, 
          this.targetBuilding.pos.add(new Coord(Math.cos(dir) * distance, Math.sin(dir) * distance)),
          Math.floor(this.enemyCount/50) + 4
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

    var name = building?.constructor.name;
    if ( name ) {
      this.buildingCount[name] = this.buildingCount[name] || 0;
      if ( this.buildingMax[name] && this.buildingCount[name] >= this.buildingMax[name] ) {
        building.remove();
        this.engine.flash.show("You cannot build anymore " + building.constructor.name + "s");
        this.engine.sounds.play("buzz");
        return false;
      }
    }

    pos = pos || building?.tilePos;
    var buildSize = building?.size || "small";
    for ( var i = 0; i < Field.BUILDING_TILES[buildSize].length; i++ ) {
      var buildingPos = pos.add(Field.BUILDING_TILES[buildSize][i]);
      
      var oldBuilding = this.buildings[buildingPos.x][buildingPos.y];
      if ( oldBuilding && (building || !oldBuilding.remove()) ) {
        building?.remove();
        this.engine.flash.show("You cannot build on top of another building");
        this.engine.sounds.play("buzz");
        return false;
      }
      for ( var k = 0; k < Field.BUILDING_TILES[oldBuilding?.size]?.length; k++ ) {
        var oldBuildingPos = oldBuilding.tilePos.add(Field.BUILDING_TILES[oldBuilding.size][k]);
        this.buildings[oldBuildingPos.x][oldBuildingPos.y] = null;
      }
      if ( oldBuilding ) {
        this.signalBuildingChange(oldBuilding.tilePos, oldBuilding.size);
      }
    }

    for ( var i = 0; i < Field.BUILDING_TILES[buildSize].length; i++ ) {
      var buildingPos = pos.add(Field.BUILDING_TILES[buildSize][i]);
      this.buildings[buildingPos.x][buildingPos.y] = building;
    }

    if ( building ) {
      this.signalBuildingChange(pos, building.size);
    }

    if ( !building && oldBuilding ) {
      this.buildingCount[oldBuilding.constructor.name]--;
    } else {
      this.buildingCount[name]++;
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
    this.enemyCount = 0;
  }

  endWave() {
    this.targetBuilding = null;
    this.engine.getObjects("enemy").forEach(enemy => {
      enemy.despawn()
    });
  }
}