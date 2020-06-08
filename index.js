import GameEngine from './engine/GameEngine.js';
import TileSet from './engine/gfx/Tileset.js';
import Building from './gameObjects/Building.js';
import { Coord } from './engine/GameMath.js';
import HotBar from './engine/gfx/HotBar.js';

window.onload = function() {
  var engine = new GameEngine(1920, 1080, {
    // showFullscreenSplash: true,
    showFullscreenIcon: true,
  });
  engine.images.preload(["empty", "blueOre", "miner"]);
  
  engine.onKeyPress(event => {
    if ( event.key == 'f' ) {
      engine.goFullscreen();
    }
  });

  engine.load().then(() => {
    var hotBar = new HotBar(engine, [engine.images.get("miner")]);
    engine.register(hotBar, true);

    var fieldWidth = 100;
    var fieldHeight = 100;

    var field = [];
    for(var x = 0; x < fieldWidth; x++) {
      field[x] = [];
      for(var y = 0; y < fieldHeight; y++) {
        field[x][y] = {
          ground: 'empty',
          buildings: [],
        };
      }
    }
    field[49][49].ground = field[48][50].ground = field[49][50].ground = field[50][50].ground = 'blueOre';

    var tileSet = new TileSet(engine, field);
    engine.register(tileSet);

    var selectedTile = new Coord(0, 0);
    var cursorBuilding = null;
    var cursorOrientation = "right";
    var nextOrientation = {
      right: "down",
      down: "left",
      left: "up",
      up: "right",
    };

    engine.onKeyPress(event => {
      if ( event.key === "1" ) {
        if ( cursorBuilding ) {
          engine.unregister(cursorBuilding);
        }
        cursorBuilding = new Building(tileSet, selectedTile.x, selectedTile.y, engine.images.get("miner"), cursorOrientation);
        engine.window.register(cursorBuilding, true);
        hotBar.selected = 1;
      }
      if ( event.key === "r" ) {
        if ( cursorBuilding ) {
          cursorOrientation = nextOrientation[cursorOrientation];
          cursorBuilding.orientation = cursorOrientation;
        } else {
          var tileBuildings = field[selectedTile.x][selectedTile.y].buildings;
          for(var i = 0; i < tileBuildings.length; i++) {
            var building = tileBuildings[i];
            building.orientation = nextOrientation[building.orientation];
          }
        }
      }
    })

    engine.onMouseMove(event => {
      selectedTile = tileSet.getTileAtCoord(event.pos);
      if ( cursorBuilding && !cursorBuilding.pos.equals(selectedTile) ) {
        cursorBuilding.pos = selectedTile;
      }
    });

    engine.onMouseDown(event => {
      if ( event.button === "left" ) {
        if ( cursorBuilding ) {
          cursorBuilding.alpha = 1;
          engine.unregister(cursorBuilding);
          field[selectedTile.x][selectedTile.y].buildings.push(cursorBuilding);
          cursorBuilding = null;
          hotBar.selected = 0;
        }
      }
      if ( event.button === "right" ) {
        if ( cursorBuilding ) {
          engine.unregister(cursorBuilding);
          cursorBuilding = null;
          hotBar.selected = 0;
        } else {
          field[selectedTile.x][selectedTile.y].buildings = [];
        }
      }
    })

    engine.update(() => {
      if ( cursorBuilding ) {

      }
    });
  });
}