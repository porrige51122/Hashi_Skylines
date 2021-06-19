const KeyboardInput = require('../core/interface.js');
const Transitions   = require('../core/transitions.js');
const MenuManager   = require('./managers/MenuManager.js');
const AssetManager  = require('./managers/AssetManager.js');
const GameManager   = require('./managers/GameManager.js');
const Store         = require('../core/Store.js');
const Helpers       = require('../core/helpers.js');

/**
 * GameController Class
 * Initiates all the different sections of the game using promises.
 * @author Aidan Smithers
 */
module.exports = class GameController {
  /**
   * Initialises a few essential variables, and brings in more functions with the
   * helpers class.
   */
  constructor() {
    this.body = document.body;
    this.state = undefined;
    this.getWindowSize();
    this.helpers = new Helpers(this);
  }

  /**
   * Sets the class' variables of the window size forces an aspect ratio of 16:9.
   */
  getWindowSize() {
    let width = window.innerWidth/16;
    let height = window.innerHeight/9;
    let res = width < height ? width : height;
    this.width = res * 16;
    this.height = res * 9;
  }

  /**
   * Starts the assetManager class and resolves once all assets are loaded.
   * @returns {Promise} Returns and resolves once assets are loaded
   */
  load() {
    return new Promise((resolve) => {
      this.assets = new AssetManager;
      this.assets.load().then(() => {
        resolve()
      });
    })
  }

  /**
   * Initialises all event listeners.
   * - Resize event listener which runs the onResize function when screen size changes
   * @see onResize()
   * @param gc
   */
  initEvents(gc) {
    window.addEventListener("resize", () => {this.onResize()});
  }

  /**
   * Initialises the storage of all High Scores. Only overwrites if they
   * do not exist beforehand
   */
  initStorage() {
    this.store = new Store({
      configName: 'high-scores',
      defaults: {
        '11':   {time: 9999999999999},
      }
    })
  }

  /**
   * Initialises controls using the Keyboard Input class
   * @see KeyboardInput
   */
  initControls() {
    this.input = new KeyboardInput();
    this.input.engine = this;
    // ESC (quit)
    // this.input.esc.release = function() { window.close() };
  }

  /**
   * Initialises the renderer for PIXI.js.
   * - Sets the background
   * - Forces the style of the canvas
   * - Initialises the stage
   */
  initRenderer() {
    this.renderer = new PIXI.autoDetectRenderer(this.width,this.height,{
     backgroundColor:0x161616
    });
    document.body.appendChild(this.renderer.view);
    this.stage = new PIXI.Container();
    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.left = "50%";
    this.renderer.view.style.top = "50%";
    this.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
    this.renderer.view.style.display = "block";
    this.renderer.autoResize = false;
    this.renderer.resize(window.innerWidth, window.innerHeight);
  }

  /**
   * Sets the new window size on the renderer, runs the resize function on all
   * managers.
   * Also, it makes sure there is WebGL support.
   */
  onResize() {
    this.getWindowSize();
    this.renderer.resize(this.width,this.height);
    if (this.menuManager !== undefined) {
      this.transitions.resize(this);
      this.menuManager.resize()
      this.gameManager.resize()

    }
    if (!this.renderer) {
      return;
    }

    this.isWebGL = this.renderer instanceof PIXI.WebGLRenderer
    if (!this.isWebGL) {
      alert("No GL Support: this app requires OpenGL.");
    }
  }

  /**
   * Initialises all managers which will in turn create all the menus and transitions.
   * @see MenuManager
   * @see GameManager
   * @see Transitions
   */
  initStates() {
    this.menuManager = new MenuManager(this);
    this.gameManager = new GameManager(this);
    this.gameManager.visible = false;
    this.transitions = new Transitions(this);

    this.stage.addChild(this.menuManager, this.gameManager)
  }

  /**
   * Renders the renderer each frame.
   */
  engineRender() {
    if (this.renderer) {
      this.renderer.render(this.stage);
    }
  }
}
