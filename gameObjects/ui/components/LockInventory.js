import { UIComponent } from "../../../engine/gfx/ui/window/UIComponent.js";
import Text from "../../../engine/gfx/Text.js";

export default class LockInventory extends UIComponent {
  static ICON_SIZE = 100;
  static ICON_SPACING = 10;
  static BOX_PADDING = 10;
  static ICON_EVERY = this.ICON_SIZE + this.ICON_SPACING + this.BOX_PADDING*2;
  static ICON_LINE_WIDTH = 4;

  static COST_POSITIONS = [
    {x: 0, y: 5},
    {x: 0, y: 55},
    {x: 100, y: 5},
    {x: 100, y: 55},
  ]

  selected = -1;

  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.lock = options.lock;

    this.height = Object.keys(this.lock.inventory).length*LockInventory.ICON_EVERY;
  }

  onMouseMove(event) {
    this.selected = Math.floor(event.pos.y/LockInventory.ICON_EVERY);
  }

  onMouseClick(event) {
    if ( this.selected !== -1 ) {
      this.lock.outerBuilding?.setUnlock?.(Object.keys(this.lock.inventory)[this.selected]);
    }
  }

  drawComponent() {
    var inventory = this.lock.outerBuilding?.getLockInventoryLessBuildQueue?.();
    Object.keys(inventory).forEach((key, i) => {
      var top = i*LockInventory.ICON_EVERY;
      var item = inventory[key];

      this.ctx.fillStyle = "#aaa";
      this.ctx.fillRect(0, top, this.canvas.width, LockInventory.ICON_SIZE + LockInventory.BOX_PADDING*2);

      this.ctx.lineWidth = LockInventory.ICON_LINE_WIDTH;

      this.ctx.fillStyle = this.selected === i ? "#9f9" : "#fff";
      this.ctx.fillRect(
        LockInventory.ICON_LINE_WIDTH/2 + LockInventory.BOX_PADDING, top + LockInventory.ICON_LINE_WIDTH/2 + LockInventory.BOX_PADDING,
        LockInventory.ICON_SIZE - LockInventory.ICON_LINE_WIDTH/2, LockInventory.ICON_SIZE - LockInventory.ICON_LINE_WIDTH/2,
      );
      item.icon.draw(
        this.ctx, 
        LockInventory.BOX_PADDING, top + LockInventory.BOX_PADDING,
        LockInventory.ICON_SIZE, LockInventory.ICON_SIZE
      );
      this.ctx.strokeStyle = this.selected === i ? "#050" : "#000";
      this.ctx.strokeRect(
        LockInventory.ICON_LINE_WIDTH/2 + LockInventory.BOX_PADDING, top + LockInventory.ICON_LINE_WIDTH/2 + LockInventory.BOX_PADDING,
        LockInventory.ICON_SIZE - LockInventory.ICON_LINE_WIDTH/2, LockInventory.ICON_SIZE - LockInventory.ICON_LINE_WIDTH/2,
      );

      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(
        LockInventory.ICON_SIZE - 25 + LockInventory.BOX_PADDING, top + LockInventory.ICON_SIZE - 25 + LockInventory.BOX_PADDING,
        25 - LockInventory.ICON_LINE_WIDTH/2, 25 - LockInventory.ICON_LINE_WIDTH/2,
      );
      this.ctx.strokeRect(
        LockInventory.ICON_SIZE - 25 + LockInventory.ICON_LINE_WIDTH/2 + LockInventory.BOX_PADDING,
        top + LockInventory.ICON_SIZE - 25 + LockInventory.ICON_LINE_WIDTH/2 + LockInventory.BOX_PADDING,
        25 - LockInventory.ICON_LINE_WIDTH/2, 25 - LockInventory.ICON_LINE_WIDTH/2,
      );
      Text.draw(this.ctx, inventory[key].count,
        LockInventory.ICON_SIZE - 12 + LockInventory.BOX_PADDING, top + LockInventory.ICON_SIZE - 22 + LockInventory.BOX_PADDING,
        {
          fontSize: 17,
          fontWeight: "bold",
          fontColor: "#060",
          center: true,
        },
      )

      var costKeys = Object.keys(item.cost);
      
      costKeys.forEach((costKey, i) => {
        var pos = LockInventory.COST_POSITIONS[i];
        this.engine.images.get(costKey).draw(this.ctx, 140 + pos.x, top + 10 + pos.y, 30, 30);
        Text.draw(this.ctx, item.cost[costKey], 
          180 + pos.x, top + 10 + pos.y,
          {fontSize: 25}
        );
      });
    });
  }
}