import { UIComponent } from "../UIComponent.js";
import Text from "../../../Text.js";

export default class Title extends UIComponent{
  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.bgColor = options.bgColor;

    this.icon = options.icon;

    this.text = new Text(options.text ?? '', 0, 0, options);

    if ( this.icon ) {
      this.text.x += this.text.fontSize + 10;
    }

    this.height = this.text.fontSize * 1.2;
  }

  drawComponent() {
    if ( this.bgColor ) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    if ( this.icon ) {
      this.icon.draw(this.ctx, 0, 3, this.text.fontSize, this.text.fontSize);
    }
    this.text.draw(this.ctx);
  }
}
