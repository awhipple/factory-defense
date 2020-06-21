import GameEngine from "./engine/GameEngine.js";
import Field from "./gameObjects/Field.js";
import HotBar from "./engine/gfx/ui/HotBar.js";
import { Coord, NEXT_ORIENTATION } from "./engine/GameMath.js";
import Lock from "./gameObjects/buildings/Lock.js";
import { BUILDINGS } from "./gameObjects/buildings/Building.js";
import { Miner, Conveyor, Unlocker, Tower } from "./gameObjects/buildings/index.js";
import Alert from "./engine/gfx/effects/Alert.js";

export default class Game {
  constructor() {
    this.engine = new GameEngine(1920, 1080, {
      // showFullscreenSplash: true,
      showFullscreenIcon: true,
    });

    // Debug
    window.engine = this.engine;
    // this.engine.setProd();

    this.engine.globals.blue = 0;
    this.engine.images.preload(["empty", "blueOre", "lock", "oreChunk", "conveyorCorner", "beaker"]);
    this.engine.images.preload(BUILDINGS);
    this.engine.sounds.alias("music", "tsuwami_magenta-and-cyan");
    
    this.engine.onKeyPress(event => {
      if ( event.key == 'f' ) {
        engine.goFullscreen();
      }
    });

    if ( this.engine.prod ) {
      this.engine.on("firstInteraction", () => {
        this.engine.sounds.play("music", {loop: true});
      });
    }
  }

  play() {
    this.engine.load().then(() => {
      this.hotBar = new HotBar(engine, BUILDINGS.slice(0, 3).map((b) => engine.images.get(b)));
      this.hotBar.onSelect(selected => {
        // Prevent the same click from selecting a tower and building in the same step.
        setTimeout(() => this.setBuild(selected), 0);
      });
      this.engine.register(this.hotBar);

      this.field = new Field(engine, 100, 100);
      this.engine.register(this.field);
      this.engine.globals.field = this.field;
      var lockCoord = new Coord(55, 50);
      this.field.setBuildingAt(new Lock(this.engine, lockCoord));

      this.tileSet = this.field.tileSet;

      if ( this.engine.dev ) {
        this._setUpTestBuildings();
      }

      this.alert = new Alert(this.engine, "WARNING!", "alarm");
      this.engine.register(this.alert);
      this.engine.globals.alert = this.alert;

      this.selectedTile = new Coord(0, 0);
      this.cursorBuilding = null;
      this.hoverBuilding = null;
      this.cursorOrientation = "right";
      this.deleteMode = false;

      this.engine.onKeyPress(event => {
        if ( ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key) ) {
          this.hotBar.select(parseInt(event.key));
        }
        if ( event.key === 'r' ) {
          this.rotateCursor();
        }
        if ( event.key === 'c' ) {
          window.debugBuilding = this.field.getBuildingAt(selectedTile);
          console.log(window.debugBuilding);
        }
        if ( this.engine.dev && event.key === 'm' ) {
          this.engine.sounds.play("music", {loop: true});
        }
      })

      this.engine.onMouseMove(event => {
        this.oldSelectedTile = this.selectedTile;
        this.selectedTile = this.tileSet.tilePos(event.pos).floor();
        if ( !this.selectedTile.equals(this.oldSelectedTile) ) {
          var newHoverBuilding = this.field.getBuildingAt(this.selectedTile);
          if ( !this.cursorBuilding && this.hoverBuilding !== newHoverBuilding ) {
            this.hoverBuilding?.unHover();
            newHoverBuilding?.hover();
            
            this.hoverBuilding = newHoverBuilding;
          }
          if ( this.cursorBuilding && !this.cursorBuilding.pos.equals(this.selectedTile) ) {
            this.cursorBuilding.moveTo(this.selectedTile);
          }
          if ( this.deleteMode ) {
            this.field.removeBuildingAt(this.selectedTile);
          }
        }
      });

      this.engine.onMouseDown(event => {
        if ( event.button === "left" ) {
          this.build();
        }
        if ( event.button === "right" ) {
          this.remove();
        }
      });

      this.engine.onMouseUp(event => {
        if ( event.button === "right" ) {
          this.deleteMode = false;
        }
      })

      this.engine.on("unlock", () => {
        this.hotBar.addIcon(this.engine.images.get("tower"));
      });

    });
  }

  rotateCursor() {
    if ( this.cursorBuilding ) {
      this.cursorOrientation = NEXT_ORIENTATION[this.cursorOrientation];
      this.cursorBuilding.rotate(this.cursorOrientation);
    } else {
      var tileBuilding = this.field.getBuildingAt(this.selectedTile);
      if ( tileBuilding ) {
        tileBuilding.rotate();
      }
    }
  }

  setBuild(selected) {
    this.cursorBuilding?.remove();
    var Type = [null, Conveyor, Miner, Unlocker, Tower][selected];
    if ( Type ) {
      this.cursorBuilding = new Type(this.engine, this.selectedTile, this.cursorOrientation);
      this.cursorBuilding.alpha = 0.4;
      this.cursorBuilding.on = false;
      this.hoverBuilding?.unHover();
      this.hoverBuilding = this.cursorBuilding;
      this.hoverBuilding.hover();
      this.hotBar.selected = selected;
    }
  }

  build() {
    if ( this.cursorBuilding ) {
      this.cursorBuilding.alpha = 1;
      this.cursorBuilding.on = true;
      if ( !this.field.setBuildingAt(this.cursorBuilding, this.selectedTile) ) {
        this.cursorBuilding.remove();
      }
      this.cursorBuilding = null;
      this.hotBar.selected = 0;
    }
  }

  remove() {
    if ( this.cursorBuilding ) {
      this.cursorBuilding.remove();
      this.cursorBuilding = null;
      this.hotBar.selected = 0;
    } else {
      this.deleteMode = true;
      this.field.removeBuildingAt(this.selectedTile);
    }
  }

  _setUpTestBuildings() {
    this.field.setBuildingAt(new Miner(this.engine, new Coord(50, 50), "right"));
    this.field.setBuildingAt(new Conveyor(this.engine, new Coord(51, 50), "right"));
    this.field.setBuildingAt(new Conveyor(this.engine, new Coord(52, 50), "right"));
    // this.field.setBuildingAt(new Conveyor(this.engine, new Coord(53, 50), "right"));
    this.field.setBuildingAt(new Unlocker(this.engine, new Coord(55, 50), "left"));
    this.field.setBuildingAt(new Miner(this.engine, new Coord(49, 50), "down"));
    this.field.setBuildingAt(new Miner(this.engine, new Coord(48, 50), "down"));
    this.field.setBuildingAt(new Conveyor(this.engine, new Coord(49, 51), "right"));
    this.field.setBuildingAt(new Conveyor(this.engine, new Coord(48, 51), "right"));
    this.field.setBuildingAt(new Conveyor(this.engine, new Coord(50, 51), "right"));
    this.field.setBuildingAt(new Conveyor(this.engine, new Coord(51, 51), "up"));
    this.field.setBuildingAt(new Tower(this.engine, new Coord(50, 49), "left"));
    this.field.setBuildingAt(new Miner(this.engine, new Coord(49, 49), "right")); 
  }
}