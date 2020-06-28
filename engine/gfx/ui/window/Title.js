import { UIComponent } from "./UIComponent.js";

export default class Title extends UIComponent{
  constructor(suggestedWidth, options = {}) {
    super(suggestedWidth);

    this.color = options.color ?? "#0f0";
  }

  drawComponent() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
