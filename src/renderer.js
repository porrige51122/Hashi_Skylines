// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const GameController = require('./game/GameController');

let appInit = null;

class AppInit {
  constructor() {
    this.gc = new GameController();
    // Uses promises to make sure everything is loaded in order

  }

  start() {
    return new Promise((resolve) => {
      this.gc.load().then(() => {
        // Initialize Resize and Controls
        this.gc.initRenderer();
        this.gc.initEvents(this.gc);
        this.gc.initControls();
        this.gc.initStorage();
        this.gc.onResize();
        // Start the Scenes
        this.gc.initStates();
        resolve();
      });
    })
  }
}

// Making sure program runs when everything is loaded. Prevents Errors
addEventListener( 'load', Go );
function Go() {
  appInit = new AppInit;
  appInit.start().then(requestAnimationFrame(Loop));
}

function Loop() {
  appInit.gc.engineRender();
  requestAnimationFrame(Loop);
}
