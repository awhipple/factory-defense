import { UIComponent } from "../../../engine/gfx/ui/window/UIComponent.js";
import Text from "../../../engine/gfx/Text.js";
import Bar from "../../../engine/gfx/ui/Bar.js";

export default class UnlockProgress extends UIComponent {
  height = 100;

  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.unlocker = options.unlocker;
  }

  drawComponent() {
    this.ctx.fillStyle = "#aaf";
    this.ctx.fillRect(0, 0, 100, 100);
    this.engine.images.get("conveyor").draw(this.ctx, 0, 0, 100, 100);

    var progresses = this.unlocker.getProgress();
    var top = 50 - progresses.length*15;
    progresses.forEach(progress => {
      progress.icon.draw(this.ctx, 120, top, 25, 25);
      Bar.draw(this.ctx, {x: 155, y: top, w: 280, h: 25}, progress.val, progress.max, progress.color);
      Text.draw(this.ctx, progress.val + "/" + progress.max, 300, top, {fontSize: 20, center: true});

      top += 30;
    });
  }
}