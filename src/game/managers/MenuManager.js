const MainMenu      = require('../menus/MainMenu.js')
const RandomMenu    = require('../menus/RandomMenu.js')
const CreatorMenu   = require('../menus/CreatorMenu.js')
const VictoryScreen = require('../menus/VictoryScreen.js')

/**
 * Organises all Menus and switches between them by changing visibility.
 * @author Aidan Smithers
 */
module.exports = class MenuManager extends PIXI.Container {
  /**
   * Makes the GameController variable accessible across all subclasses
   * @param gc Game Controller Class
   */
  constructor(gc) {
    super();
    this.gc = gc;
    this.resize();
  }

  /**
   * Creates all menu classes and based on previous visibility, it determines which
   * menu is on the screen.
   */
  resize() {
    // As the main menu is the first visible screen, set that menu to true.
    let visible = [true, false, false, false];
    if (this.mainMenu !== undefined) {
      visible[0] = this.mainMenu.visible;
      visible[1] = this.randomMenu.visible;
      visible[2] = this.victoryScreen.visible;
      visible[3] = this.creatorMenu.visible;
      this.removeChildren();
    }
    this.mainMenu      = new MainMenu(this.gc);
    this.randomMenu    = new RandomMenu(this.gc);
    this.victoryScreen = new VictoryScreen(this.gc);
    this.creatorMenu   = new CreatorMenu(this.gc);

    this.mainMenu.visible      = visible[0];
    this.randomMenu.visible    = visible[1];
    this.victoryScreen.visible = visible[2];
    this.creatorMenu.visible   = visible[3];
    this.addChild(this.mainMenu, this.randomMenu, this.victoryScreen, this.creatorMenu);
  }
}
