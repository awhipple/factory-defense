export default class HotBar {
  constructor(engine, iconImages = [], iconCount = 9, iconSize = 75, iconSpacing = 15) {
    this.engine = engine;
    this.iconCount = iconCount;
    this.iconSize = iconSize;
    this.iconSpacing = iconSpacing;
    this.iconImages = iconImages;
    this.selected = 0;

    this.width = iconCount * (iconSize + iconSpacing) + iconSpacing;
    this.height = iconSize + 2 * iconSpacing;
    this.startX = engine.window.width/2 - this.width/2;
    this.startY = engine.window.height - this.height;
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
        ctx.drawImage(this.iconImages[i], startX, startY, this.iconSize, this.iconSize);
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