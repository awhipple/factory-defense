import Text from "./Text.js";

export default class FlashText extends Text {
  alpha = 1;
  hide = true;
  z = 100;
  
  constructor(engine) {
    super('YOLO', engine.window.width/2, 20, {fontColor: "#a33", center: true});
  }

  show(str) {
    this.str = str;
    this.alpha = 1;
    this.hide = false;
    this.showTime = 4;
  }
  
  update() {
    this.showTime = Math.max(this.showTime -= 1/60, 0);
    this.alpha = Math.min(this.alpha, this.showTime);
  }
}