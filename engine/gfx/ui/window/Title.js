import { UIComponent } from "./UIComponent.js";
import Text from "../../Text.js";

export default class Title extends UIComponent{
  constructor(suggestedWidth, options = {}) {
    super(suggestedWidth);

    this.bgColor = options.bgColor;

    this.text = new Text(options.text ?? '', 0, 0);
  }

  drawComponent() {
    if ( this.bgColor ) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.text.draw(this.ctx);
  }
}
