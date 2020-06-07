export default class FullscreenSplash {
  constructor(engine) {
    this.engine = engine;

    engine.onMouseClick(event => {
      if ( !this.engine.fullscreen ) {
        engine.goFullscreen();
      }
    });
  }

  draw(ctx) {
    if ( !this.engine.fullscreen ) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.engine.window.width, this.engine.window.height);
      ctx.fillStyle = "#666";
      ctx.fillRect(600, 450, 400, 100);
      ctx.fillStyle = "#000";
      ctx.font = "50px Arial";
      ctx.fillText("Click to Play!", 640, 515);
      ctx.stroke();
    }
  }
}