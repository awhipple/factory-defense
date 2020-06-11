import TileSet from "../engine/gfx/Tileset.js";

export default class Field {
  field = [];

  constructor(engine, width, height) {
    this.engine = engine;
    this.width = width;
    this.height = height;

    for(var x = 0; x < width; x++) {
      this.field[x] = [];
      for(var y = 0; y < height; y++) {
        this.field[x][y] = {
          ground: 'empty',
          building: null,
        };
      }
    }
    this.field[49][49].ground = this.field[48][50].ground = this.field[49][50].ground = this.field[50][50].ground = 'blueOre';

    this.tileSet = new TileSet(engine, this.field);
    engine.globals.tileSet = this.tileSet;
    engine.register(this.tileSet);
  }

  getBuildingAt(pos) {
    return this.field[pos.x][pos.y].building;
  }

  setBuildingAt(pos, building) {
    var tile = this.field[pos.x][pos.y];
    if ( tile.building ) {
      this.engine.unregister(tile.building);
    }
    tile.building = building;
  }
}