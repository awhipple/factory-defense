import { BoundingRect } from "../GameMath.js";

export default class HotBar {
  selected = 0;
  z = 4;

  constructor(engine, iconImages = [], iconSize = 75, iconSpacing = 15) {
    this.engine = engine;
    this.iconCount = iconImages.length;
    this.iconSize = iconSize;
    this.iconSpacing = iconSpacing;
    this.iconImages = iconImages;

    this.width = this.iconCount * (iconSize + iconSpacing) + iconSpacing;
    this.height = iconSize + 2 * iconSpacing;
    this.startX = engine.window.width/2 - this.width/2;
    this.startY = engine.window.height - this.height;

    engine.onMouseDown(event => {
      if (
        event.pos.x > this.startX && event.pos.x < this.startX + this.width &&
        event.pos.y > this.startY &&
        event.pos.x % (iconSize + iconSpacing) > iconSpacing
      ) {
        this.select(Math.ceil((event.pos.x-this.startX)/(iconSize + iconSpacing)));
      }
    });
  }

  select(selected) {
    if(selected > 0 && selected <= this.iconCount) {
      this.selected = selected;
      if ( this.callback ) {
        this.callback(this.selected);
      }
    }
  }

  onSelect(callback) {
    this.callback = callback;
  }

  draw(ctx) {
    ctx.fillStyle = "#999";
    ctx.fillRect(this.startX, this.startY, this.width, this.height);
    ctx.lineWidth = 3;
    ctx.strokeRect(this.startX, this.startY, this.width, this.height);

    ctx.font = "bold 15px Arial";
    for(var i = 0; i < this.iconCount; i++) {
      ctx.strokeStyle = this.selected === i + 1 ? "green" : "black";
      var startX = this.startX + (this.iconSize + this.iconSpacing) * i + this.iconSpacing;
      var startY = this.startY + this.iconSpacing;
      ctx.fillStyle = this.selected === i + 1 ? "lightgreen" : "white";
      ctx.fillRect(
        startX, startY,
        this.iconSize, this.iconSize,
      );
      if ( this.iconImages[i] ) {
        this.iconImages[i].draw(ctx, new BoundingRect(startX, startY, this.iconSize, this.iconSize));
      }
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, this.iconSize, this.iconSize);
      ctx.fillRect(startX, startY + this.iconSize - 17, 17, 17);
      ctx.strokeRect(startX, startY + this.iconSize - 17, 17, 17);
      ctx.fillStyle = "#000";
      ctx.fillText(i + 1, startX + 3, startY + this.iconSize - 3);
    }
    ctx.stroke();
  }
}