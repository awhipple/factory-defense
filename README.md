# Game Engine Documentation

## GameEngine

This is the core game engine.

```
GameEngine(screenWidth, screenHeight, options = {})

options = {
  showFullScreenSplash: true, // Show splash screen when window is not fullscreen.
  showFullScreenIcon: true, // Show a button on the bottom right to go fullscreen.
}
```

### Methods
* `register(gameObject)`: The engine will invoke the game objects update and draw methods once per frame.
* `unregister(gameObject)`: Unregister the game object from the engine.
* `load(callback)`: **callback** will be called once all assets have been loaded.
* `goFullscreen()`: Makes the game go fullscreen.
* `onKeyPress(callback)`: Calls **callback** with a key event when a key is pressed.
* `onKeyDown(callback)`: Calls **callback** with a key event once per game loop while the key is down.
* `onMouseMove(callback)`: Calls **callback** with a mouse event when the mouse moves.
* `onMouseDown(callback)`: Calls **callback** with a mouse event when the mouse is clicked.
* `onMouseUp(callback)`: Calls **callback** with a mouse event when a mouse button is released.
* `onMouseWheel(callback)`: Calls **callback** with a mouse event when the mouse wheel is scrolled.
* `onUpdate(callback)`: Starts the game engine and calls the **callback** once per game update loop.

### Properties
* `images`: An instance of **ImageLibrary** that contains all your game's images.
* `mousePos`: An instance of **Coord** representing the current mouse position.
* `fullscreen`: A boolean representing whether the app is currently fullscreen.

## ImageLibrary

This contains all of your apps images, and is automatically instantiated with your game engine. Images should be in the project root in the `images` folder and should be PNG's. The image names are the same as the file name without the `.png` extension.

```
var engine = new GameEngine(...);
engine.images
```

## Image

## Sprite

## HotBar

## Shapes

### Methods
* `get(imageName)`: Returns the image with the specified name.
* `preload(imageName|[imageName])`: Will begin loading the specified image/images and cause the engine to wait until loading completes before calling the **load** callback. You can call this method multiple times.

## Events

### Key Event
```
{
  key: "space",
}
```

### Mouse Event
```
{
  button: "left",
  pos: {
    x: 100,
    y: 100,
  },
  wheelDirection: "down",
}
```
