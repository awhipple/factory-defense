import Building from "./Building.js";
import { Coord } from "../../engine/GameMath.js";
import Resource from "../../gameObjects/Resource.js"

export default class Conveyor extends Building {
  resources = [];
  feedsToConveyor = true;
  z = 10;

  constructor(engine, pos, orientation) {
    super(engine, pos, "conveyor", orientation);
    
    this.conveyorImage = this.img;
    this.conveyorCornerImage = engine.images.get("conveyorCorner");
    this._updateImage();    
    
    this.moveCoord = Coord[orientation];
  }

  rotate(orientation) {
    super.rotate(orientation);
    this.moveCoord = Coord[this.orientation];
    this._updateImage();    
  }

  moveTo(coord) {
    super.moveTo(coord);

    this._updateImage();
  }

  handOff(resource) {
    if ( this.resources.length < 1 / Resource.collisionSize ) {
      this.resources.unshift(resource);
      return true;
    } else {
      return false;
    }
  }

  update() {
    for ( var i = 0; i < this.resources.length; i++ ) {
      var res = this.resources[i];
      if ( !this._inCenter(res) ) {
        var isHorizontal = this._isHorizontal();
        var checkPos = isHorizontal ? res.pos.y : res.pos.x;
        var slideDirection = checkPos % 1 < 0.5 ? 1 : -1;
        var slideVector = isHorizontal ? Coord.down : Coord.right;
        res.move(slideVector.times(slideDirection), 1/60);
        
        var newCheckPos = isHorizontal ? res.pos.y : res.pos.x;
        var newSlideDirection = newCheckPos % 1 < 0.5 ? 1 : -1;
        if ( newSlideDirection !== slideDirection ) {
          res.moveTo(res.pos.floor().add(Coord.half));
        }
      } else if ( this.pos.equals(res.pos.floor()) ) {
        var nextResource = this.resources[i+1]
        if ( nextResource?.pos.distanceTo(res.pos) < Resource.collisionSize) {
          continue;
        }
        res.move(this.moveCoord, 1/60);
      } else {
        var handoffBuilding = this.field.getBuildingAt(this.pos.add(Coord[this.orientation]));
        if ( handoffBuilding?.handOff?.(res) ) {
          this.resources.splice(i, 1);
          i--;
        }
      }
    }
  }

  onNeighborUpdate() {
    this._updateImage();
  }

  _updateImage() {
    var checkBuilding;

    this.img = this.engine.images.get("conveyor").rotate(this.orientation);

    checkBuilding = this.field.getBuildingAt(this.pos.add(Coord.left));
    if ( checkBuilding && checkBuilding.feedsToConveyor && checkBuilding.orientation === "right" ) {
      switch ( this.orientation ) {
        case "up":   this.img = this.conveyorCornerImage.rotate("up").mirror();
                     break;
        case "down": this.img = this.conveyorCornerImage.rotate("down");
                     break;
      }
    }

    checkBuilding = this.field.getBuildingAt(this.pos.add(Coord.up));
    if ( checkBuilding && checkBuilding.feedsToConveyor && checkBuilding.orientation === "down" ) {
      switch ( this.orientation ) {
        case "left":  this.img = this.conveyorCornerImage.rotate("left");
                      break;
        case "right": this.img = this.conveyorCornerImage.rotate("right").mirror();
                      break;
      }
    }

    checkBuilding = this.field.getBuildingAt(this.pos.add(Coord.right));
    if ( checkBuilding && checkBuilding.feedsToConveyor && checkBuilding.orientation === "left" ) {
      switch ( this.orientation ) {
        case "up":   this.img = this.conveyorCornerImage.rotate("up");
                     break;
        case "down": this.img = this.conveyorCornerImage.rotate("down").mirror();
                     break;
      }
    }

    checkBuilding = this.field.getBuildingAt(this.pos.add(Coord.down));
    if ( checkBuilding && checkBuilding.feedsToConveyor && checkBuilding.orientation === "up" ) {
      switch ( this.orientation ) {
        case "left":  this.img = this.conveyorCornerImage.rotate("left").mirror();
                      break;
        case "right": this.img = this.conveyorCornerImage.rotate("right");
                      break;
      }
    }
  }

  _inCenter(res) {
    var coordVal = this._isHorizontal() ? res.pos.y : res.pos.x;
    return coordVal % 1 === 0.5;
  }

  _isHorizontal() {
    return this.orientation === "left" || this.orientation === "right";
  }
}