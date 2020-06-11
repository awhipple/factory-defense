import { Coord, BoundingRect } from "../GameMath.js";

export default class TileSet {
  camZoom = 100;
  camZoomHighRes = 100;
  dragCam = false;
  z = 0;

  constructor(engine, field, options = {}) {
    this.engine = engine;
    this.width = field.length;
    this.height = field[0].length;
    this.field = field;

    this.camCenter = new Coord(this.width/2, this.height/2);

    engine.onMouseDown(event => {
      if ( event.button === "left") {
        this.lastMousePos = event.pos;
        this.dragCam = true;
      }
    });
    engine.onMouseUp(event => {
      if (event.button === "left") {
        this.dragCam = false;
      }
    });
    engine.onMouseMove(event => {
      if ( this.dragCam ) {
        this.camCenter.x -= (event.pos.x - this.lastMousePos.x) / this.camZoom;
        this.camCenter.y -= (event.pos.y - this.lastMousePos.y) / this.camZoom;
        this.lastMousePos = event.pos;
      }
    });
    engine.onMouseWheel(event => {
      if ( event.wheelDirection === "up" ) {
        this.camZoomHighRes *= 1.1;
        if ( this.camZoomHighRes > 400 ) {
          this.camZoomHighRes = 400;
        }
      } else if ( event.wheelDirection === "down" ) {
        this.camZoomHighRes *= 0.9;
        if ( this.camZoomHighRes < 25 ) {
          this.camZoomHighRes = 25;
        }
      }
      this.camZoom = Math.floor(this.camZoomHighRes);
    });
  }

  viewportX(tileX) {
    return this.engine.window.width / 2 - (this.camCenter.x - tileX) * this.camZoom;
  }
  viewportY(tileY) {
    return this.engine.window.height / 2 - (this.camCenter.y - tileY) * this.camZoom;
  }

  getScreenRect(tileRect) {
    return new BoundingRect(
      this.viewportX(tileRect.x), this.viewportY(tileRect.y),
      tileRect.w * this.camZoom, tileRect.h * this.camZoom
    );
  }

  getTileAtCoord(pos) {
    return new Coord(
      Math.floor(((this.engine.window.width / 2 - pos.x) / -this.camZoom + this.camCenter.x)),
      Math.floor(((this.engine.window.height / 2 - pos.y) / -this.camZoom + this.camCenter.y)));    
  }

  getTileBoundingRect(tile) {
    return new BoundingRect(this.viewportX(tile.x), this.viewportY(tile.y), this.camZoom, this.camZoom);
  }

  draw(ctx) {
    var tileSpanX = this.engine.window.width / this.camZoom + 1,
        startTileX = Math.max(0, Math.floor(this.camCenter.x - tileSpanX/2)),
        endTileX = Math.min(this.width, Math.ceil(this.camCenter.x + tileSpanX/2));

    var tileSpanY = this.engine.window.height / this.camZoom + 1,
        startTileY = Math.max(0, Math.floor(this.camCenter.y - tileSpanY/2)),
        endTileY = Math.min(this.height, Math.ceil(this.camCenter.y + tileSpanY/2));

    for(var y = startTileY; y < endTileY; y++) {
      for(var x = startTileX; x < endTileX; x++) {
        var tileX = this.viewportX(x), tileY = this.viewportY(y),
            tile = this.field[x][y];
        ctx.drawImage(this.engine.images.get(tile.ground), tileX, tileY, this.camZoom, this.camZoom);
        if ( tile.building ) {
          tile.building.draw(ctx);
        }
      }
    }
  }
}