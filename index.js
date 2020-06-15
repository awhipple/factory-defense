import GameEngine from './engine/GameEngine.js';
import { BUILDINGS } from './gameObjects/buildings/Building.js';
import { Coord, NEXT_ORIENTATION } from './engine/GameMath.js';
import HotBar from './engine/gfx/ui/HotBar.js';
import Miner from './gameObjects/buildings/Miner.js';
import Conveyor from './gameObjects/buildings/Conveyor.js';
import Field from './gameObjects/Field.js';
import Unlocker from './gameObjects/buildings/Unlocker.js';
import Lock from './gameObjects/buildings/Lock.js';
import Alert from './engine/gfx/effects/Alert.js';
import Tower from './gameObjects/buildings/Tower.js';

window.onload = function() {
  var engine = new GameEngine(1920, 1080, {
    // showFullscreenSplash: true,
    showFullscreenIcon: true,
  });

  // Debug
  window.engine = engine;

  engine.globals.blue = 0;
  engine.images.preload(["empty", "blueOre", "lock", "oreChunk", "conveyorCorner"]);
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

    var field = new Field(engine, 100, 100);
    engine.register(field);
    engine.globals.field = field;
    var lockCoord = new Coord(55, 50);
    field.setBuildingAt(lockCoord, new Lock(engine, lockCoord));

    var alert = new Alert(engine, "WARNING!");
    engine.register(alert);
    engine.globals.alert = alert;

    var selectedTile = new Coord(0, 0);
    var cursorBuilding = null;
    var cursorOrientation = "right";
    var deleteMode = false;

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
      selectedTile = field.tileSet.tilePos(event.pos).floor();
      if ( cursorBuilding && !cursorBuilding.pos.equals(selectedTile) ) {
        cursorBuilding.moveTo(selectedTile);
      }
      if ( deleteMode ) {
        field.removeBuildingAt(selectedTile);
      }
    });

    engine.onMouseDown(event => {
      if ( event.button === "left" ) {
        build();
      }
      if ( event.button === "right" ) {
        remove();
      }
    });

    engine.onMouseUp(event => {
      if ( event.button === "right" ) {
        deleteMode = false;
      }
    })

    function setBuild(selected) {
      cursorBuilding?.remove();
      var Type = [0, Conveyor, Miner, Unlocker, Tower][selected];
      if ( Type ) {
        cursorBuilding = new Type(engine, selectedTile, cursorOrientation);
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
        cursorBuilding.alpha = 1;
        cursorBuilding.on = true;
        if ( !field.setBuildingAt(selectedTile, cursorBuilding) ) {
          cursorBuilding.remove();
        }
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
        deleteMode = true;
        field.removeBuildingAt(selectedTile);
      }
    }
  });
}