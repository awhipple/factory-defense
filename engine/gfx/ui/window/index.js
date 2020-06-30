import GameObject from '../../../objects/GameObject.js';
import nativeComponents from './nativeComponents.js';
import { BoundingRect } from '../../../GameMath.js';

export default class UIWindow extends GameObject {
  scroll = 0;

  constructor(engine, shape, ui = [], options = {}) {
    super(engine, shape);

    this.ui = ui;

    this.z = options.z ?? 100;
    this.outerPadding = options.outerPadding ?? 10;
    this.innerPadding = options.innerPadding ?? options.padding ?? 15;
    
    this.scrollSpeed = options.scrollSpeed ?? 30;
  }

  draw(ctx) {
    ctx.save();

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
        this.innerRect.w - this.innerPadding*2, img.height
      );
      currentY += img.height + this.innerPadding;
    });

    ctx.drawImage(
      this.canvas, 
      0, this.scroll, 
      this.canvas.width, this.innerRect.h, 
      this.innerRect.x, this.innerRect.y, 
      this.innerRect.w, this.innerRect.h
    );

    ctx.restore();
  }

  onMouseClick(event) {
    this._triggerEventInComponent(event, "onMouseClick");
  }

  onMouseWheel(event) {
    if ( event.wheelDirection === "up" ) {
      this.scroll -= this.scrollSpeed;
    } else if ( event.wheelDirection === "down" ) {
      this.scroll += this.scrollSpeed;
    }

    this.scroll = Math.max(0, this.scroll);
    this.scroll = Math.min(this.maxScroll, this.scroll);

    this.onMouseMove(event);
  }

  onMouseMove(event) {
    this._triggerEventInComponent(event, "onMouseMove");
  }

  get x() {
    return super.x;
  }

  set x(val) {
    super.x = val;

    this._setInnerRect();
  }

  _setInnerRect() {
    this.innerRect = new BoundingRect(
      this.rect.x + this.outerPadding, this.rect.y + this.outerPadding,
      this.rect.w - this.outerPadding * 2, this.rect.h - this.outerPadding * 2);
  }

  _generateComponents() {
    this.components = [];

    this._setInnerRect();
    this.componentHeightMap = [];

    this.ui.forEach(component => {
      var Type = typeof component.type === "string" ?
        nativeComponents[component.type] :
        component.type;
      if ( Type ) {
        var newComponent = new Type(this.engine, this.innerRect.w - this.innerPadding*2, component);
        newComponent.initializeCanvas();
        this.components.push(newComponent);
        this.componentHeightMap.push([newComponent.height, newComponent]);
      }
    });

    this.canvas = this.canvas ?? document.createElement("canvas");
    this.canvas.width = this.rect.w - this.outerPadding*2;
    this.canvas.height = this.components.reduce(
      (total, com) => total + com.canvas.height + this.innerPadding, 0
    ) + this.innerPadding;
    this.ctx = this.canvas.getContext("2d");
    this.maxScroll = Math.max(0, this.canvas.height - this.rect.h + this.outerPadding * 2);
  }

  _triggerEventInComponent(event, type) {
    var totalPadding = this.outerPadding + this.innerPadding;

    if ( event.relPos.x < totalPadding || event.relPos > this.rect.w - totalPadding) {
      return;
    }

    var comY = event.relPos.y + this.scroll - totalPadding;
    for ( var i = 0; i < this.componentHeightMap.length; i++ ) {
      if ( comY < 0 ) {
        return;
      }
      comY -= this.componentHeightMap[i][0];
      if ( comY < 0 ) {
        if ( typeof this.componentHeightMap[i][1][type] === "function") {
          event.pos = { x: event.relPos.x - totalPadding, y: comY + this.componentHeightMap[i][0] };
          delete event.relPos;
          this.componentHeightMap[i][1][type](event);
        }
        return;
      }
      comY -= this.innerPadding;
    }
  }
}
