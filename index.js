import GameEngine from './engine/GameEngine.js';
import TileSet from './engine/gfx/Tileset.js';
import Building from './gameObjects/Building.js';
import { Coord } from './engine/GameMath.js';

window.onload = function() {
  var engine = new GameEngine(1920, 1080, {
    showFullscreenSplash: false,
  });
  engine.images.preload(["empty", "blueOre", "miner"]);
  
  engine.onKeyPress(event => {
    if ( event.key == 'f' ) {
      engine.goFullscreen();
    }
  });

  engine.load().then(() => {
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
    field[50][50].ground = 'blueOre';

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
        cursorBuilding = new Building(selectedTile.x, selectedTile.y, engine.images.get("miner"), cursorOrientation);
        field[selectedTile.x][selectedTile.y].buildings.push(cursorBuilding);
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
        var oldBuildingsArray = field[cursorBuilding.pos.x][cursorBuilding.pos.y].buildings;
        oldBuildingsArray.splice(oldBuildingsArray.indexOf(cursorBuilding), 1);

        cursorBuilding.pos = selectedTile;
        field[selectedTile.x][selectedTile.y].buildings.push(cursorBuilding);
      }
    });

    engine.onMouseDown(event => {
      if ( event.button === "left" ) {
        cursorBuilding = null;
      }
    })

    engine.update(() => {
    });
  });
}