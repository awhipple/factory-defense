import HotBar from "../../engine/gfx/ui/HotBar.js";

export default class BuildingHotbar extends HotBar {
  z = 60;

  constructor(engine, buildingNames, buildingCount, buildingMax) {
    super(engine, buildingNames.map((b) => engine.images.get(b)));

    this.buildingNames = buildingNames;
    this.buildingCount = buildingCount;
    this.buildingMax = buildingMax;
  }

  draw(ctx) {
    super.draw(ctx);

    for(var i = 0; i < this.iconCount; i++) {
      var bName = this.buildingNames[i];
      if ( this.buildingMax[bName]) {
        var startX = this.rect.x + (this.iconSize + this.iconSpacing) * i + this.iconSpacing;
        var startY = this.rect.y + this.iconSpacing;

        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.fillRect(startX + this.iconSize - 20, startY + this.iconSize - 17, 20, 17);
        ctx.strokeRect(startX + this.iconSize - 20, startY + this.iconSize - 17, 20, 17);
        ctx.fillStyle = this.buildingCount[bName] < this.buildingMax[bName] ? "#060" : "#f00";
        ctx.fillText(this.buildingMax[bName] - this.buildingCount[bName], startX + this.iconSize - 18, startY + this.iconSize - 3);
      }
    }
  }
}