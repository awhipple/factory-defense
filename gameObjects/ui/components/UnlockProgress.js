import { UIComponent } from "../../../engine/gfx/ui/window/UIComponent.js";
import Text from "../../../engine/gfx/Text.js";
import Bar from "../../../engine/gfx/ui/Bar.js";

export default class UnlockProgress extends UIComponent {
  height = 120;

  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.lock = options.lock;
  }

  drawComponent() {
    if ( this.lock.outerBuilding?.unlockTarget ) {
      var unlocker = this.lock.outerBuilding;

      this.ctx.fillStyle = "#aaf";
      this.ctx.fillRect(0, 0, 100, 100);
      unlocker.unlockTarget.icon?.draw(this.ctx, 0, 0, 100, 100);

      var progresses = unlocker.getProgress();
      var top = 50 - progresses.length*15;
      progresses.forEach(progress => {
        progress.icon.draw(this.ctx, 120, top, 25, 25);
        Bar.draw(this.ctx, {x: 155, y: top, w: 280, h: 25}, progress.val, progress.max, progress.color);
        Text.draw(this.ctx, progress.val + "/" + progress.max, 300, top, {fontSize: 20, center: true});

        top += 30;
      });
    } else if (this.lock.outerBuilding) {
      Text.draw(this.ctx, "Select an item to unlock below", 40, 40, {fontSize: 20, fontColor: "#005"});
    } else {
      Text.draw(this.ctx, "Build an unlocker around this lock", 40, 40, {fontSize: 20, fontColor: "#005"});
    }
  }
}