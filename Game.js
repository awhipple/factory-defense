import GameEngine from "./engine/GameEngine.js";
import Field from "./gameObjects/Field.js";
import { Coord, NEXT_ORIENTATION } from "./engine/GameMath.js";
import Lock from "./gameObjects/buildings/Lock.js";
import { BUILDINGS } from "./gameObjects/buildings/Building.js";
import { Miner, Conveyor, Unlocker, Tower } from "./gameObjects/buildings/index.js";
import Alert from "./engine/gfx/effects/Alert.js";
import Camera from "./engine/gfx/Camera.js";
import BuildingHotbar from "./gameObjects/ui/BuildingHotbar.js";
import UIWindow from "./engine/gfx/ui/window/index.js";
import UnlockProgress from "./gameObjects/ui/components/UnlockProgress.js";
import LockInventory from "./gameObjects/ui/components/LockInventory.js";

export default class Game {
  constructor() {
    this.engine = new GameEngine();

    // Debug
    window.engine = this.engine;
    // this.engine.setProd();

    this.menuX = this.engine.window.width + 5;

    this.engine.images.preload([
      "empty", "blueore", 
      "lock", "conveyorcorner",
      "blueres", "redres", "beaker",
    ]);
    this.engine.images.preload(BUILDINGS);
    this.engine.sounds.alias("music", "tsuwami_magenta-and-cyan");

    this.engine.sounds.preload(["alarm", "laser", "shot", "buzz"]);

    if ( this.engine.prod ) {
      this.engine.on("firstInteraction", () => {
        this.engine.sounds.play("music", {loop: true});
      });
    }
  }

  play() {
    this.engine.load().then(() => {

      this.initialize();

      this.engine.onKeyPress(event => {
        if ( ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key) ) {
          this.hotBar.select(parseInt(event.key));
        }
        if ( event.key === 'r' ) {
          this.rotateCursor();
        }
        if ( event.key === 'c' ) {
          window.debugBuilding = this.field.getBuildingAt(this.selectedTile);
          console.log(window.debugBuilding);
        }
        if ( this.engine.dev && event.key === 'm' ) {
          this.engine.sounds.play("music", {loop: true});
        }
      })

      this.engine.onMouseMove(event => {
        this.lastSelectedTile = this.selectedTile;
        this.selectedTile = this.cam.getPos(event.pos).floor();
        if ( !this.selectedTile.equals(this.lastSelectedTile) ) {
          if ( this.cursorBuilding instanceof Conveyor && this.engine.mouse.left) {
            var mouseMoveDirection = this.lastSelectedTile.directionTo(this.selectedTile);
            var lastSelectedBuilding = this.field.getBuildingAt(this.lastSelectedTile);
            if ( lastSelectedBuilding instanceof Conveyor ) {
              lastSelectedBuilding.rotate(mouseMoveDirection);
            }
            this.cursorBuilding.rotate(mouseMoveDirection);
            this.cursorBuilding.moveTo(this.selectedTile);
            this.cursorBuilding.build(this.selectedTile);
            this.cursorBuilding = this.cursorBuilding.clone();
          }

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
        if ( event.button === "right" ) {
          this.remove();
        }
      });

      this.engine.on("buildingBuilt", () => {
        this.cursorBuilding = this.cursorBuilding instanceof Conveyor ? 
          this.cursorBuilding?.clone() : 
          null;
        this.hotBar.selected = 0;
      });

      this.engine.on("menuOn", () => {
        this.slideMenuOut = true;
        this.menu.scroll = 0;
      });
      this.engine.on("menuOff", () => {
        this.slideMenuOut = false;
      });
      this.engine.onUpdate(() => {
        if ( this.slideMenuOut ) {
          this.menuX = Math.max(this.menuX - 25, this.engine.window.width - 498);
        } else {
          this.menuX = Math.min(this.menuX + 25, this.engine.window.width + 5)
        }
        if (this.menu) {
          this.menu.originX = this.menuX;
        }
      });

      this.engine.onMouseUp(event => {
        if ( this.cursorBuilding instanceof Conveyor || !this.dontRemoveCursorOnMouseUp ) {
          this.cursorBuilding?.remove();
          this.cursorBuilding = null;
        }
        this.dontRemoveCursorOnMouseUp = false;

        if ( event.button === "right" ) {
          this.deleteMode = false;
        }
      })

      this.engine.on("unlock", () => {
        this.hotBar.addIcon(this.engine.images.get("tower"));
      });

    });
  }

  initialize() {
    this.cam = new Camera(this.engine, 50, 50, 100, 25, 400);

    this.engine.globals.cam = this.cam;

    this.field = new Field(engine, 100, 100);
    this.engine.register(this.field);
    this.engine.globals.field = this.field;

    this.hotBar = new BuildingHotbar(
      engine, BUILDINGS, 
      this.field.buildingCount, this.field.buildingMax
    );
    this.hotBar.onSelect(selected => {
      this.setBuild(selected);
      this.dontRemoveCursorOnMouseUp = true;
    });
    this.engine.register(this.hotBar);

    this.lock = new Lock(this.engine, new Coord(55, 50));
    this.field.setBuildingAt(this.lock);

    this.slideMenuOut = this.engine.dev;
    this.menu = new UIWindow(
      this.engine, 
      {
        x: this.menuX, 
        y: this.engine.window.height/2-300, 
        w: 500, 
        h: 610, 
      }, 
      [
        {
          type: "title",
          icon: this.engine.images.get("lock"),
          text: "Unlocker",
        },
        {
          type: "title",
          text: "Current Progress:",
          fontSize: 20,
        },
        {
          type: UnlockProgress,
          lock: this.lock,
        },
        {
          type: "title",
          text: "Available:",
          fontSize: 20,
        },
        {
          type: LockInventory,
          lock: this.lock,
        },
      ], 
      {
        z: 60,
        innerPadding: 15, 
        outerPadding: 15,
      }
    );
    this.engine.register(this.menu);

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
      this.cursorBuilding.virtual = true;
      this.hoverBuilding?.unHover();
      this.hoverBuilding = this.cursorBuilding;
      this.hoverBuilding.hover();
      this.hotBar.selected = selected;
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
    this._buildTestBuilding(new Miner(this.engine, new Coord(50, 50), "right"));
    this._buildTestBuilding(new Conveyor(this.engine, new Coord(51, 50), "right"));
    this._buildTestBuilding(new Conveyor(this.engine, new Coord(52, 50), "right"));
    this._buildTestBuilding(new Unlocker(this.engine, new Coord(55, 50), "left"));
    
    // this._buildTestBuilding(new Miner(this.engine, new Coord(49, 50), "down"));
    // this._buildTestBuilding(new Miner(this.engine, new Coord(48, 50), "down"));
    // this._buildTestBuilding(new Conveyor(this.engine, new Coord(49, 51), "right"));
    // this._buildTestBuilding(new Conveyor(this.engine, new Coord(48, 51), "right"));
    // this._buildTestBuilding(new Conveyor(this.engine, new Coord(50, 51), "right"));
    // this._buildTestBuilding(new Conveyor(this.engine, new Coord(51, 51), "up"));

    this._buildTestBuilding(new Tower(this.engine, new Coord(50, 49), "left"));
    this._buildTestBuilding(new Miner(this.engine, new Coord(49, 49), "right"));
    
  }

  _buildTestBuilding(testBuilding) {
    testBuilding.build();
  }
}