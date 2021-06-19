const Colours = require('../../../res/colours.js');
let Sound = require('pixi-sound');

/**
 * Initialises all the assets
 * @author Aidan Smithers
 */
module.exports = class AssetManager {
  /**
   * Initialises the PIXI Loader
   * @see PIXI.Loader
   */
  constructor() {
    this.sprites = [];
    this.sounds = [];
    this.loader = new PIXI.loaders.Loader();
  }

  /**
   * Loads the images, videos and audio and resolves the promise once all are loaded
   * @returns {Promise<>}
   */
  load() {
    return new Promise((resolve) => {
      this.loader.add('building1', '../res/Building1.png')
                 .add('building2', '../res/Building2.png')
                 .add('building3', '../res/Building3.png')
                 .add('light0', '../res/Lights0.png')
                 .add('light1', '../res/Lights1.png')
                 .add('light2', '../res/Lights2.png')
                 .add('light3', '../res/Lights3.png')
                 .add('light4', '../res/Lights4.png')
                 .add('light5', '../res/Lights5.png')
                 .add('light6', '../res/Lights6.png')
                 .add('light7', '../res/Lights7.png')
                 .add('light8', '../res/Lights8.png')
                 .add('victoryBackground', '../res/VictoryScreen.png')
                 .add('gameSound', '../res/GameMusic.mp3')
                 .add('menuSound', '../res/Hashiskylinestheme.wav');

      this.loader.load((loader) => {
        let video = PIXI.Texture.from('../res/MainMenu.mp4')
        let gameBG = PIXI.Texture.from('../res/GameBackground.mp4');
        this.sprites.mainMenu = new PIXI.Sprite(video);
        this.sprites.gameBackground = gameBG
        this.sprites.buildings = []
        this.sprites.buildings.push(loader.resources.building1.texture);
        this.sprites.buildings.push(loader.resources.building2.texture);
        this.sprites.buildings.push(loader.resources.building3.texture);
        this.sprites.lights = []
        this.sprites.lights.push(loader.resources.light0.texture)
        this.sprites.lights.push(loader.resources.light1.texture)
        this.sprites.lights.push(loader.resources.light2.texture)
        this.sprites.lights.push(loader.resources.light3.texture)
        this.sprites.lights.push(loader.resources.light4.texture)
        this.sprites.lights.push(loader.resources.light5.texture)
        this.sprites.lights.push(loader.resources.light6.texture)
        this.sprites.lights.push(loader.resources.light7.texture)
        this.sprites.lights.push(loader.resources.light8.texture)
        this.sprites.victoryScreen = loader.resources.victoryBackground.texture;
        for (let i = 0; i < this.sprites.buildings.length; i++) {
          new PIXI.Sprite(this.sprites.buildings[i])
        }
        for (let i = 0; i < this.sprites.lights.length; i++) {
          new PIXI.Sprite(this.sprites.lights[i])
        }
        new PIXI.Sprite(this.sprites.victoryScreen);
        video.baseTexture.source.setAttribute('loop', "true");
        gameBG.baseTexture.source.setAttribute('loop', "true");
        this.colours = Colours;
        this.sounds.push(loader.resources.gameSound.data);
        this.sounds[0].loop = true;
        this.sounds.push(loader.resources.menuSound.data);
        this.sounds[1].loop = true;
        this.sounds[1].play();
      })
      this.loader.onComplete.add(() => {
        resolve();
      })
    })
  }

  stopAllSounds() {
    for (let i = 0; i < this.sounds.length; i++) {
      this.sounds[i].pause();
      this.sounds[i].currentTime = 0;
    }
  }
}
