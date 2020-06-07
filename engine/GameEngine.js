import GameWindow from './gfx/GameWindow.js';
import ImageLibrary from './gfx/ImageLibrary.js';
import { KeyNames, MouseButtonNames } from './input/Enums.js';
import { Coord } from './GameMath.js';
import Button from './objects/Button.js';
import FullscreenSplash from './objects/FullScreenSplash.js';

export default class GameEngine {
  constructor(width, height, options = {}) {
    this.window = new GameWindow(this, width, height, "gameCanvas");
    this.images = new ImageLibrary();
    this.images.preload("fullscreen");

    this.keyDownCallbacks = [];
    this.pressedKeys = {};
    document.addEventListener('keydown', (event) => {
      var key = KeyNames[event.keyCode] || event.keyCode;
      this.pressedKeys[key] = true;
    });
    document.addEventListener('keyup', (event) => {
      var key = KeyNames[event.keyCode] || event.keyCode;
      delete this.pressedKeys[key];
    });

    this.mousePos = new Coord(0, 0);
    this.window.canvas.addEventListener('mousemove', event => {
      this.mousePos = this.getMouseCoord(event);
    });

    this.fullscreen = false;
    document.addEventListener('fullscreenchange', (event) => {
      this.fullscreen = !!document.fullscreenElement;
    });
    if ( options.showFullscreenSplash ) {
      this.window.register(new FullscreenSplash(this));
    }

    this.images.load().then(() => {
      if ( options.showFullscreenIcon ) {
        this.fullscreenButton = new Button(this, this.images.get("fullscreen"), width-20, height-20, 0.05);
        this.register(this.fullscreenButton);
      }
    });
  }

  register(object) {
    this.window.register(object);
  }

  unregister(object) {
    this.window.unregister(object);
  }

  update(gameLoop) {
    setInterval(() => {
      var pressedKeys = Object.keys(this.pressedKeys);
      for(var i = 0; i < this.keyDownCallbacks.length; i++) {
        for(var k = 0; k < pressedKeys.length; k++) {
          this.keyDownCallbacks[i]({key: pressedKeys[k]});
        }
      }
      gameLoop();
    }, 1000/60);
  }

  load() {
    return this.images.load();
  }

  goFullscreen() {
    this.window.canvas.requestFullscreen();
  }

  onKeyPress(callback) {
    document.addEventListener('keydown', (event) => {
      callback({key: KeyNames[event.keyCode] || event.keyCode});
    });
  }

  onKeyDown(callback) {
    this.keyDownCallbacks.push(callback);
  }

  onMouseMove(callback) {
    this.window.canvas.addEventListener('mousemove', event => {
      callback({pos: this.getMouseCoord(event)});
    });
  }

  onMouseClick(callback) {
    this.window.canvas.addEventListener('mousedown', event => {
      callback({button: MouseButtonNames[event.button] || event.button});
    });
  }

  getMouseCoord(event) {
    var canvas = this.window.canvas;
    var rect = canvas.getBoundingClientRect();
    var scale = canvas.height / rect.height;
    var subX = rect.width-2 != canvas.width ? 
      (rect.width - canvas.width/scale) / 2 :
      rect.left;
    return new Coord((event.clientX - subX) * scale, (event.clientY - rect.top) * scale);
  }
}