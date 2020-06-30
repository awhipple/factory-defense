import { UIComponent } from "../../../engine/gfx/ui/window/UIComponent.js";

export default class LockInventory extends UIComponent {
  height = 106;

  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.lock = options.lock;
  }

  drawComponent() {
    this.lock.getInventory().forEach(item => {
      item.icon.draw(this.ctx, 2, 2, 100, 100);
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 4;
      this.ctx.strokeRect(2, 2, 100, 100);
    });
  }
}