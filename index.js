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
  engine.images.preload(["empty", "blueOre", "lock", "oreChunk", "conveyorCorner", "beaker"]);
  engine.images.preload(BUILDINGS);
  engine.sounds.preload(["tsuwami_magenta-and-cyan", "gunshot"]);
  engine.sounds.alias("song", "tsuwami_magenta-and-cyan");

  engine.onKeyPress(event => {
    if ( event.key == 'f' ) {
      engine.goFullscreen();
    }
  });

  engine.load().then(() => {
    // engine.sounds.play("song");
    var hotBar = new HotBar(engine, BUILDINGS.slice(0, 3).map((b) => engine.images.get(b)));
    hotBar.onSelect(selected => {
      // Prevent the same click from selecting a tower and building in the same step.
      setTimeout(() => setBuild(selected), 0);
    });
    engine.register(hotBar);

    var field = new Field(engine, 100, 100);
    engine.register(field);
    engine.globals.field = field;
    var lockCoord = new Coord(55, 50);
    field.setBuildingAt(new Lock(engine, lockCoord));

    // Test Code
    field.setBuildingAt(new Miner(engine, new Coord(50, 50), "right"));
    field.setBuildingAt(new Conveyor(engine, new Coord(51, 50), "right"));
    field.setBuildingAt(new Conveyor(engine, new Coord(52, 50), "right"));
    field.setBuildingAt(new Conveyor(engine, new Coord(53, 50), "right"));
    field.setBuildingAt(new Unlocker(engine, new Coord(55, 50), "left"));
    field.setBuildingAt(new Tower(engine, new Coord(50, 49), "left"));
    field.setBuildingAt(new Miner(engine, new Coord(49, 49), "right")); 

    var alert = new Alert(engine, "WARNING!");
    engine.register(alert);
    engine.globals.alert = alert;

    var selectedTile = new Coord(0, 0);
    var cursorBuilding = null;
    var hoverBuilding = null;
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
      var newHoverBuilding = field.getBuildingAt(selectedTile);
      if ( !cursorBuilding && hoverBuilding !== newHoverBuilding ) {
        hoverBuilding?.unHover();
        newHoverBuilding?.hover();
        
        hoverBuilding = newHoverBuilding;
      }
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

    engine.on("unlock", () => {
      hotBar.addIcon(engine.images.get("tower"));
    });

    function setBuild(selected) {
      cursorBuilding?.remove();
      var Type = [null, Conveyor, Miner, Unlocker, Tower][selected];
      if ( Type ) {
        cursorBuilding = new Type(engine, selectedTile, cursorOrientation);
        cursorBuilding.alpha = 0.4;
        cursorBuilding.on = false;
        hoverBuilding?.unHover();
        hoverBuilding = cursorBuilding;
        hoverBuilding.hover();
        hotBar.selected = selected;
      }
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
        if ( !field.setBuildingAt(cursorBuilding, selectedTile) ) {
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