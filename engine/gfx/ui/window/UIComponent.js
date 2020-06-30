import Image from "../../Image.js";

// Classes should extend this and implement the drawComponent method
export class UIComponent {

  constructor(engine, suggestedWidth) {
    this.engine = engine;
    this.suggestedWidth = suggestedWidth;
  }

  initializeCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width ?? this.suggestedWidth;
    this.canvas.height = this.height ?? 100;
    
    this.img = new Image(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  
  getDisplayImage() {
    if ( !this.ctx ) {
      this.initializeCanvas();
    }

    this._clearCanvas();

    this.drawComponent();
    
    return this.img;
  }
  
  _clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}