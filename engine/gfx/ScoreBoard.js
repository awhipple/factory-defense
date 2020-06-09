export default class ScoreBoard {
  constructor(engine) {
    this.engine = engine;

    this.z = 100;
  }

  draw(ctx) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 190, 85);
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 190, 85);

    ctx.drawImage(this.engine.images.get("oreChunk"), 10, 10, 60, 60);

    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(this.engine.blue, 90, 60);

    ctx.stroke();
  }
}