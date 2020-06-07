import GameEngine from './engine/GameEngine.js';

window.onload = function() {
  var engine = new GameEngine(1920, 1080, {
    showFullscreenSplash: false,
  });
  
  engine.onKeyPress(event => {
    if ( event.key == 'f' ) {
      engine.goFullscreen();
    }
  });

  engine.load().then(() => {
    engine.update(() => {

    });
  });
}