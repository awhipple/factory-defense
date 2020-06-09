import GameEngine from './engine/GameEngine.js';
import Building, { BUILDINGS } from './gameObjects/Building.js';
import { Coord, NEXT_ORIENTATION } from './engine/GameMath.js';
import HotBar from './engine/gfx/HotBar.js';
import Miner from './gameObjects/Miner.js';
import Conveyor from './gameObjects/Conveyor.js';
import Collector from './gameObjects/Collector.js';
import Field from './gameObjects/Field.js';
import ScoreBoard from './engine/gfx/ScoreBoard.js';

// TO DO:
// FIX BELT CENTERING LOGIC
// Remove blue score from engine
// Make ScoreBoard generic

window.onload = function() {
  var engine = new GameEngine(1920, 1080, {
    // showFullscreenSplash: true,
    showFullscreenIcon: true,
  });
  engine.blue = 0;
  engine.images.preload(["empty", "blueOre", "oreChunk"]);
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

    var selectedTile = new Coord(0, 0);
    var cursorBuilding = null;
    var cursorOrientation = "right";

    engine.onKeyPress(event => {
      if ( ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key) ) {
        hotBar.select(parseInt(event.key));
      }
      if ( event.key === "r" ) {
        rotateCursor();
      }
    })

    engine.onMouseMove(event => {
      selectedTile = field.tileSet.getTileAtCoord(event.pos);
      if ( cursorBuilding && !cursorBuilding.pos.equals(selectedTile) ) {
        cursorBuilding.pos = selectedTile;
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
      if ( cursorBuilding ) {
        engine.unregister(cursorBuilding);
      }
      if ( selected === 1 ) {
        cursorBuilding = new Conveyor(field, selectedTile.x, selectedTile.y, cursorOrientation);
      } else if ( selected === 2 ) {
        cursorBuilding = new Miner(field, selectedTile.x, selectedTile.y, cursorOrientation);
      } else if ( selected === 3 ) {
        cursorBuilding = new Collector(field, selectedTile.x, selectedTile.y, cursorOrientation);
      } else {
        cursorBuilding = new Building(field, selectedTile.x, selectedTile.y, engine.images.get(BUILDINGS[selected-1]), cursorOrientation);
      }
      engine.register(cursorBuilding);
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
        cursorBuilding.alpha = 1;
        cursorBuilding.on = true;
        field.setBuildingAt(selectedTile, cursorBuilding);
        cursorBuilding = null;
        hotBar.selected = 0;
      }
    }

    function remove() {
      if ( cursorBuilding ) {
        engine.unregister(cursorBuilding);
        cursorBuilding = null;
        hotBar.selected = 0;
      } else {
        var tile = field.field[selectedTile.x][selectedTile.y];
        if ( tile.building ) {
          engine.unregister(tile.building);
          tile.building = null;
        }
      }
    }

  });
}