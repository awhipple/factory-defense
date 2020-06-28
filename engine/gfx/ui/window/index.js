import GameObject from '../../../objects/GameObject.js';
import nativeComponents from './nativeComponents.js';

export default class UIWindow extends GameObject {
  scroll = 0;

  constructor(engine, shape, ui = [], options = {}) {
    super(engine, shape);

    this.ui = ui;

    this.z = options.z ?? 100;
    this.outerPadding = options.outerPadding ?? 2;
    this.innerPadding = options.innerPadding ?? options.padding ?? 15;
  }

  draw(ctx) {
    if ( !this.components ) {
      this._generateComponents();
    }

    super.draw(ctx, this.engine, "#fff");

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var currentY = this.innerPadding;
    this.components.forEach(component => {
      var img = component.getDisplayImage();
      img.draw(
        this.ctx,
        this.innerPadding, currentY,
        this.rect.w - this.innerPadding*2, img.height
      );
      currentY += img.height + this.innerPadding;
    });

    ctx.drawImage(
      this.canvas, 
      0, this.scroll, 
      this.canvas.width, this.rect.h - this.outerPadding * 2, 
      this.rect.x + this.outerPadding, this.rect.y + this.outerPadding, 
      this.rect.w - this.outerPadding * 2, this.rect.h - this.outerPadding*2);
  }

  onWheel(event) {
    if ( event.wheelDirection === "up" ) {
      this.scroll--;
    } else if ( event.wheelDirection === "down" ) {
      this.scroll++;
    }
  }

  _generateComponents() {
    this.components = [];
    this.ui.forEach(component => {
      var Type = nativeComponents[component.type];
      if ( Type ) {
        var newComponent = new Type(this.rect.w, component);
        newComponent.initializeCanvas()
        this.components.push(newComponent);
      }
    });

    this.canvas = this.canvas ?? document.createElement("canvas");
    this.canvas.width = this.rect.w - this.outerPadding*2;
    this.canvas.height = this.components.reduce(
      (total, com) => total + com.canvas.height + this.innerPadding, 0
    ) + this.innerPadding;
    this.ctx = this.canvas.getContext("2d");
  }
}
