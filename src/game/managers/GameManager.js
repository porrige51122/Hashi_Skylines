const Level  = require('../board/Level.js');

/**
 * Organises all Low level functions of the game and initialises all
 * classes needed
 * @author Aidan Smithers
 */
module.exports = class GameManager extends PIXI.Container {
  /**
   * Makes the GameController variable accessible across all subclasses
   * @param gc Game Controller Class
   */
  constructor(gc) {
    super()
    this.gc = gc;
    this.resize();
  }

  /**
   * Runs Resize function for all subclasses
   */
  resize() {
    this.createFromParameters(this.cur);
  }

  /**
   * Creates a level based on input parameters
   * @param level 2D Array containing integers value 0-8 where 0 represents an empty spot
   * @param leaderboard Integer choosing what the end screen is (1 == Victory Screen, 2 == Creator Screen)
   */
  createFromParameters(level, leaderboard) {
    if (level !== undefined) {
      this.removeChild(this.level)
      this.cur = level
      this.level = new Level(this.gc, level, leaderboard)
      this.gc.assets.stopAllSounds();
      this.gc.assets.sounds[0].play();
      this.addChild(this.level);
    }
  }
}
