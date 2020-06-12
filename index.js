import GameEngine from './engine/GameEngine.js';
import Building, { BUILDINGS } from './gameObjects/buildings/Building.js';
import { Coord, NEXT_ORIENTATION } from './engine/GameMath.js';
import HotBar from './engine/gfx/HotBar.js';
import Miner from './gameObjects/buildings/Miner.js';
import Conveyor from './gameObjects/buildings/Conveyor.js';
import Collector from './gameObjects/buildings/Collector.js';
import Field from './gameObjects/Field.js';
import ScoreBoard from './engine/gfx/ScoreBoard.js';

// TO DO:
// Make ScoreBoard generic
// Take out buildings from the tileset and make buildings draw themselves
// Support different css canvas sizes
// Miner should also cause conveyor to show bend
// Fix conveyor bend image to line up properly

window.onload = function() {
  var engine = new GameEngine(1920, 1080, {
    // showFullscreenSplash: true,
    showFullscreenIcon: true,
  });

  engine.globals.blue = 0;
  engine.images.preload(["empty", "blueOre", "oreChunk", "conveyorCorner"]);
  engine.images.preload(BUILDINGS);

  engine.onKeyPress(event => {
    if ( event.key == 'f' ) {
      engine.goFullscreen();
    }
  });

  engine.load().then(() => {
    var hotBar = new HotBar(engine, BUILDINGS.map((b) => engine.images.get(b)));
    hotBar.onSelect(selected => {
      setTimeout(() => setBuild(selected), 0);
    });
    engine.register(hotBar);

    var scoreBoard = new ScoreBoard(engine);
    engine.register(scoreBoard);

    var field = new Field(engine, 100, 100);
    engine.globals.field = field;

    var selectedTile = new Coord(0, 0);
    var cursorBuilding = null;
    var cursorOrientation = "right";

    engine.onKeyPress(event => {
      if ( ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key) ) {
        hotBar.select(parseInt(event.key));
      }
      if ( event.key === 'r' ) {
        rotateCursor();
      }
      if ( event.key === 'c' ) {
        window.debugBuilding = field.getBuildingAt(selectedTile);
        console.log(debugBuilding);
      }
    })

    engine.onMouseMove(event => {
      selectedTile = field.tileSet.getTileAtCoord(event.pos);
      if ( cursorBuilding && !cursorBuilding.pos.equals(selectedTile) ) {
        cursorBuilding.moveTo(selectedTile);
      }
    });

    engine.onMouseDown(event => {
      if ( event.button === "left" ) {
        build();
      }
      if ( event.button === "right" ) {
        remove();
      }
    })

    engine.onUpdate(() => {

    });

    function setBuild(selected) {
      cursorBuilding?.remove();
      var Type = [0, Conveyor, Miner, Collector, Building][selected];
      if ( Type ) {
        cursorBuilding = new Type(engine, selectedTile.x, selectedTile.y, cursorOrientation);
      }
      hotBar.selected = selected;
    }

    function rotateCursor() {
      if ( cursorBuilding ) {
        cursorOrientation = NEXT_ORIENTATION[cursorOrientation];
        cursorBuilding.rotate(cursorOrientation);
      } else {
        var tileBuilding = field.getBuildingAt(selectedTile);
        if ( tileBuilding ) {
          tileBuilding.rotate();
        }
      }
    }

    function build() {
      if ( cursorBuilding ) {
        field.getBuildingAt(selectedTile)?.remove();
        
        cursorBuilding.alpha = 1;
        cursorBuilding.on = true;  
        field.setBuildingAt(selectedTile, cursorBuilding);
        cursorBuilding = null;
        hotBar.selected = 0;
      }
    }

    function remove() {
      if ( cursorBuilding ) {
        cursorBuilding.remove();
        cursorBuilding = null;
        hotBar.selected = 0;
      } else {
        var tile = field.field[selectedTile.x][selectedTile.y];
        if ( tile.building ) {
          tile.building.remove();
          tile.building = null;
        }
      }
    }

  });
}