import { UIComponent } from "../../../engine/gfx/ui/window/UIComponent.js";

export default class LockInventory extends UIComponent {
  selected = -1;

  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.lock = options.lock;

    this.height = Object.keys(this.lock.inventory).length*105;
  }

  onMouseMove(event) {
    this.selected = event.pos.x < 100 ? Math.floor(event.pos.y/100) : -1;
  }

  onMouseClick(event) {
    if ( this.selected !== -1 ) {
      this.lock.outerBuilding?.setUnlock?.(Object.keys(this.lock.inventory)[this.selected]);
    }
  }

  drawComponent() {
    Object.keys(this.lock.inventory).forEach((key, i) => {
      this.lock.inventory[key].icon.draw(this.ctx, 0, i*105, 100, 100);
      this.ctx.strokeStyle = this.selected === i ? "#050" : "#000";
      this.ctx.lineWidth = 4;
      this.ctx.strokeRect(2, i*105 + 2, 96, 96);
    });
  }
}