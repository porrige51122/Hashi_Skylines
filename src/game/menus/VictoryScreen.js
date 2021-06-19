module.exports = class VictoryScreen extends PIXI.Container {
  constructor(gc) {
    super();
    let w = gc.width;
    let h = gc.height;
    this.gc = gc;

    let background = new PIXI.Sprite(gc.assets.sprites.victoryScreen);
    background.width = gc.width;
    background.height = gc.height;
    this.addChild(background)

    this.title = new PIXI.Container();
    let text = new PIXI.Text("Congratulations");
    text.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: w/16,
      fill: 0xFFFFFF
    })
    text.anchor.set(0.5,0)
    text.position.set(w/4,0);
    this.title.addChild(text);
    this.addChild(this.title)

    this.back = gc.helpers.addButton(w/50,(8*h)/9, "Back", w/30, w/8, w/25, true);
    this.back.on('pointertap', () => {
                 gc.transitions.transitionFade(gc.menuManager.victoryScreen, gc.menuManager.mainMenu);
               });
    this.addChild(this.back);
  }

  generate(width,length,time) {
    let min = Math.min(width, length);
    let max = Math.max(width, length);
    this.removeChild(this.timeTaken)
    let str = max + '' + min;
    if (this.gc.store.get(str) === undefined) {
      this.gc.store.set(str, {'time': time});
    }
    let best = this.gc.store.get(str).time;
    if (time === undefined || time < best) {
      this.gc.store.set(str, {'time': time});
      best = time;
    }
    this.timeTaken = new PIXI.Container();
    let text = new PIXI.Text("Your Time: \n" + time/1000 + 's \n\n' + "Personal Best for " + max + 'x'+ min + ': \n' + best/1000 + 's');
    text.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: this.gc.width/24,
      fill: 0xFFFFFF
    })
    text.anchor.set(0,0)
    text.position.set(this.gc.width/24,this.gc.height/4);
    this.timeTaken.addChild(text);
    this.addChild(this.timeTaken)
  }
}
