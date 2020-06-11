export default class Button {
  hover = false;

  constructor(engine, img, x, y, scale) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.scale = scale;
    
    engine.onMouseMove(event => {
      if (event.pos.x > this.x-this.img.width*this.scale/2 &&
          event.pos.x < this.x+this.img.width*this.scale/2 &&
          event.pos.y > this.y-this.img.height*this.scale/2 &&
          event.pos.y < this.y+this.img.height*this.scale/2) {
        this.scale = 0.07;
        this.hover = true;   
      } else {
        this.scale = 0.05;
        this.hover = false;
      }
    });

    engine.onMouseDown(event => {
      if ( !engine.fullscreen && this.hover ) {
        engine.goFullscreen();
      }
    })
  }

  draw(ctx, engine) {
    if(!engine.fullscreen) {
      ctx.drawImage(this.img, 
        this.x-this.img.width*this.scale/2, this.y-this.img.height*this.scale/2, 
        this.img.width*this.scale, this.img.height*this.scale);
    }
  }
}