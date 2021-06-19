module.exports = class MainMenu extends PIXI.Container {
  constructor(gc) {
    super();
    let w = gc.width;
    let h = gc.height;

    this.background = gc.assets.sprites.mainMenu;
    this.background.width = w;
    this.background.height = h;
    this.addChild(this.background);

    this.title = new PIXI.Container();
    let text = new PIXI.Text("Hashi \nSkylines");
    text.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: w/16,
      fill: 0xFFFFFF
    })
    text.position.set(w/50,0);
    this.title.addChild(text);
    this.addChild(this.title);

    this.start  = gc.helpers.addButton(w/50,(3*w)/16, "Story Mode"    , w/30, w/4.5 , w/25, true);
    this.design = gc.helpers.addButton(w/50,(4*w)/16, "Level Designer", w/30, w/3.75, w/25, true);
    this.random = gc.helpers.addButton(w/50,(5*w)/16, "Random Level"  , w/30, w/4   , w/25, true);
    this.quit   = gc.helpers.addButton(w/50,(7*w)/16, "Quit"          , w/30, w/10  , w/25, true);
    this.design.on('pointertap', () => {
                gc.transitions.transitionFade(gc.menuManager.mainMenu, gc.menuManager.creatorMenu);
              });
    this.random.on('pointertap', () => {
                gc.transitions.transitionFade(gc.menuManager.mainMenu, gc.menuManager.randomMenu);
              });
    this.quit.on('pointertap', () => {
               if (confirm("Are you sure you want to quit?")) {
                 window.close();
               }
             });
    this.addChild(this.start, this.design, this.random, this.quit)
  }
}
