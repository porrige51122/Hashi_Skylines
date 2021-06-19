const Building = require('../../core/sprites/Building.js')

/**
 * Level Class
 * Converts 'level' input to a visible game. This also contains all the logic
 * for selecting, dragging and dropping cables and highlighting the tower blocks
 * once they have been selected.
 * @author Aidan Smithers
 */
module.exports = class Level extends PIXI.Container {
  /**
   * Converts level input to a visible level and does the majority of logic
   * within the class. Will aim to split up into smaller functions in the
   * future.
   * @param gc Game Controller
   * @param level Level input of 2d array containing values from 0-8 where 0 means slot is empty
   * @param leaderboard Int choosing what the end screen is (1 == Victory Screen, 2 == Creator Screen)
   */
  constructor(gc, level, leaderboard) {
    super();
    // Compulsory setup code
    this.gc = gc;
    let w = gc.width;
    let h = gc.height;
    this.buildings = [];
    this.bridges = [];
    this.leaderboard = leaderboard;
    /**
     * Needed for drawing the line:
     * lineend - where the line will end, if it starts at 0,0. It will then be
     *           moved to the correct start location. Kinda like the length.
     * curve - the location of the bezier curve points (to make it droop)
     * stren - How intense the droop of the curve is
     * drawing - variable for determining if the line should be drawn
     */
    let lineendx,lineendy,curvex,curvey,stren = false;

    // A background for the game which is animated
    let background = new PIXI.Sprite(gc.assets.sprites.gameBackground);
    background.width = gc.width;
    background.height = gc.height;

    // When the mouse is up when not on a building, reset the line and tints
    background.interactive = true;
    background.on('mouseup', () => {
      this.mouseuptint();
    });
    this.addChild(background)


    // Create all the buildings from the level variable
    for (let i = 0; i < level.length; i++) {
      for (let ii = 0; ii < level[i].length; ii++) {
        if (level[i][ii] === 0) continue;
        let building = new Building(gc, ii, i, level[i].length, level.length, level[i][ii]);
        building.render();
        this.buildings.push(building);
        building.buttonMode = building.interactive = true;
        this.addChild(building);
      }
    }

    // Highlight selectable buildings
    this.buildings.forEach((b1) => {
      b1.on('mousedown', () => {
        this.mousedowntint(b1)
      });
    })

    // When the mouse moves (And line is in drawing state) it draws a bezier
    // curve resembling a line that droops
    window.addEventListener('mousemove', e => {
      if (this.drawing) {
        // Prevents multiple lines being drawn every frame
        this.removeChild(this.line);
        this.line = new PIXI.Graphics();
        this.addChild(this.line);

        // Set starting position
        this.line.position.set(this.linestartx, this.linestarty);
        // Calculate the length from the current mouse position - start position
        lineendx = e.offsetX - this.linestartx;
        lineendy = e.offsetY - this.linestarty;

        // Calculates the droop of the line
        stren = (Math.abs(lineendx) + Math.pow(Math.abs(lineendy), 1.1)) / 10;
        curvex = (lineendx/2);
        curvey = (lineendy/2) + stren;

        // Draws the line with all the parameters
        this.line.lineStyle(2, 0xffffff)
           .moveTo(0, 0)
           .bezierCurveTo(curvex,curvey,curvex,curvey,lineendx, lineendy);
      }
    })

    // Creates the back button as a small arrow on the bottom left of the screen
    this.back = this.gc.helpers.addButton(w/50,(8*h)/9, "<", w/30, w/40, w/25, false);
    this.back.on('pointertap', () => {
                this.gc.transitions.transitionFade(gc.gameManager, gc.menuManager.mainMenu);
                this.gc.assets.stopAllSounds()
                this.gc.assets.sounds[1].play();
               });
    this.addChild(this.back);
    this.timerStart = Date.now();
  }

  /**
   * Method checks is bridge crosses any other bridge.
   * @return boolean True if bridge doesn't cross any other bridge, False if it does.
   */
  canPlaceBridge(bridge) {
    for (let i = 0; i < this.bridges.length; i++) {
      if (this.bridges[i].amount === 0) continue;
      if (bridge.crosses(this.bridges[i])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks through all the buildings to see if they have hit their value therefore
   * is a correct solution
   * @return boolean True if it is complete, false otherwise.
   */
  checkComplete() {
    for (let i = 0; i < this.buildings.length; i++) {
      if (!this.buildings[i].isComplete())
        return false;
    }
    // TODO: CHECK THAT THE ISLANDS ARE ALL CONNECTED
    this.gc.assets.stopAllSounds()
    this.gc.assets.sounds[1].play();
    let timeElapsed = Date.now() - this.timerStart;
    if (this.leaderboard === 1) {
      this.gc.menuManager.victoryScreen.generate(this.gc.menuManager.randomMenu.dims,this.gc.menuManager.randomMenu.dims,timeElapsed);
      this.gc.transitions.transitionFade(this.gc.gameManager, this.gc.menuManager.victoryScreen)
    } else {
      this.gc.transitions.transitionFade(this.gc.gameManager, this.gc.menuManager.creatorMenu);
    }
    return true;
  }

  /**
   * Makes a box light turn off around the bridge
   * @return void
   */
  mouseuptint() {
    this.buildings.forEach((b) => {
      b.lights.tint = b.tintMaster;
      b.interactive = b.buttonMode = true;
    });

    this.drawing = false;
    this.removeChild(this.line);
  }

  /**
   * make a wire connect to the mouse, then light up ONLY the buildings that can
   * be selected. All other buildings will be disabled.
   * @param b1 the selected building
   * @return void
   */
  mousedowntint(b1) {
    // dir = [up,right,down,left]
    // if the direction does not exist, it just applies the filter to b1 which
    // is already guaranteed to be valid.
    let dir = [b1,b1,b1,b1]
    this.buildings.forEach((b2) => {
      // a dark shade which makes the lights look 'off' but not pitch black
      b2.lights.tint = 0x262626;
      // disabling all other buildings
      b2.interactive = b2.buttonMode = false;

      // Attatching the building to the cardinal directionss if it applies.
      if (b2.xp === b1.xp && b2 !== b1) {
        if (b2.yp > b1.yp) {
          if (dir[0] === b1 || dir[0].yp > b2.yp)
            dir[0] = b2;
        } else {
          if (dir[2] === b1 || dir[2].yp < b2.yp)
            dir[2] = b2;
        }
      } else if (b2.yp === b1.yp && b2 !== b1) {
        if (b2.xp > b1.xp) {
          if (dir[1] === b1 || dir[1].xp > b2.xp)
            dir[1] = b2;
        } else {
          if (dir[3] === b1 || dir[3].xp < b2.xp)
            dir[3] = b2;
        }
      }
    });

    // turning back on the lights to b1 and all the dirs
    b1.lights.tint = b1.tintMaster;
    b1.interactive = b1.buttonMode = true;
    for (let i = 0; i < 4; i++) {
      if (dir[i] === b1) { continue; }
      dir[i].lights.tint = dir[i].tintMaster;
      dir[i].interactive = dir[i].buttonMode = true;
      // Allows me to add new listeners to the buldings as I need a new function
      // that wasn't in the old one.
      dir[i].removeAllListeners();
      dir[i].on('mouseup', () => {
        this.mouseuptint();
        /**
         * @see core/sprites/Bridge.js
         */
        b1.addBridge(dir[i], this);
        // returns all dirs to their original state as one has now been selected
        for (let j = 0; j < 4; j++) {
          dir[j].removeAllListeners();
          dir[j].on('mousedown', () => {
            this.mousedowntint(dir[j])
          });
        }
      })
    }

    // Start drawing the cable attatched to the mouse.
    this.linestartx = b1.posx;
    this.linestarty = b1.anchory;
    this.drawing = true;
  }
}
