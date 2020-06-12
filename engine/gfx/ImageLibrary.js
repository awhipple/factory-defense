import Image from "./Image.js";

export default class ImageLibrary {
  images = {}
  preloadPromises = [];

  constructor(path = "./images/") {
    this.path = path;
  }

  loadImage(name) {
    var img = new window.Image;
    img.src = this.path + name + ".png";
    return this.images[name] = new Image(img);
  }

  get(name) {
    return this.images[name] || this.loadImage(name);
  }

  preload(name) {
    if(typeof name == 'string') {
      name = [ name ];
    }
    for(var i = 0; i < name.length; i ++) {
      this.preloadPromises.push(new Promise((resolve, reject) => {
        this.get(name[i]).img.onload = () => {resolve()};
      }));
    }
  }

  load() {
    return Promise.all(this.preloadPromises);
  }
}