import GameEngine from './engine/GameEngine.js';

import Player from './gameObjects/Player.js';

window.onload = function() {
  var engine = new GameEngine(1200, 800, {
    showFullScreenIcon: true,
  });
  engine.images.preload(["player"]);

  engine.onKeyPress(event => {
    if ( event.key == 'f' ) {
      engine.goFullscreen();
    }
  });

  engine.load().then(() => {
    var player = new Player(engine);

    engine.update(() => {
      player.update(engine);
    });
  });
}