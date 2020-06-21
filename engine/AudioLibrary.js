export default class AudioLibrary {
  sounds = {};
  preloadPromises = {};

  constructor(root = "./sounds/") {
    this.root = root;
  }

  get(name) {
    return this.sounds[name] || this._loadSound(name);
  }

  preload(name) {
    if(typeof name === 'string') {
      name = [ name ];
    }
    for(var i = 0; i < name.length; i++) {
      this.get(name[i]);
    }
  }

  alias(name, original) {
    this.sounds[name] = this.sounds[original];
  }

  play(name) {
    this.get(name).play();
  }

  load() {
    return Promise.all(Object.values(this.preloadPromises));
  }

  _loadSound(name) {
    var sound =  new Sound(this.root + name + ".mp3");
    this.preloadPromises[name] = new Promise((resolve) => {
      // sound.onload = () => { resolve(); };
      resolve();
    });
    return this.sounds[name] = sound;
  }

}

class Sound {
  constructor(path) {
    var sound = new Audio();
    sound.src = path;
    sound.setAttribute("preload", "auto");
    
    this.channels = [ sound ];
    this.channelPointer = 0;
  }

  play() {
    this.channelPointer = (this.channelPointer + 1) % this.channels.length;
    
    if ( !this.channels[this.channelPointer].paused ) {
      this._addChannel();
    }

    this.channels[this.channelPointer].play();
  }

  _addChannel() {
    this.channels.push(this.channels[0].cloneNode());
    this.channelPointer = this.channels.length - 1;
  }
}