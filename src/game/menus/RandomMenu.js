const Generator = require('../board/Generator.js')

module.exports = class RandomMenu extends PIXI.Container {
  constructor(gc) {
    super();
    this.gc = gc;
    let w = gc.width;
    let h = gc.height;

    this.title = new PIXI.Container();
    let text = new PIXI.Text("Random");
    text.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: w/16,
      fill: 0xFFFFFF
    })
    text.anchor.set(0.5,0)
    text.position.set(w/2,0);
    this.title.addChild(text);
    this.addChild(this.title)

    this.back = gc.helpers.addButton(w/50,(8*h)/9, "Back", w/30, w/8, w/25, true);
    this.back.on('pointertap', () => {
                 gc.transitions.transitionFade(gc.menuManager.randomMenu, gc.menuManager.mainMenu);
               });
    this.addChild(this.back);

    this.dimensions = gc.helpers.incrementer2(w/15, "Dimensions", 8, 3, 20);
    this.dimensions.position.set(w/4-(w/64),h/4)
    this.dimensions.children[0].on('pointertap', () => {this.getHighScore(this.highScore, this.dimensions.children[2].val);});
    this.dimensions.children[1].on('pointertap', () => {this.getHighScore(this.highScore, this.dimensions.children[2].val);});

    this.addChild(this.dimensions);

    this.highScore = new PIXI.Text("a")
    this.highScore.style = text.style;
    this.highScore.style.fontSize /= 2;
    this.highScore.position.set(w/4-(w/64), h/2)
    this.highScore.anchor.set(0.5,0)
    this.getHighScore(this.highScore, this.dimensions.children[2].val);

    this.addChild(this.highScore);

    this.generator = new Generator(gc);
    this.generate = gc.helpers.addButton(w/2 - (2.35 * w)/16,(7*h)/9, "Generate", w/15, (2.35*w)/8, w/15, false);

    this.generate.on('pointertap', () => {
                this.dims = this.dimensions.children[2].val;
                let level = this.generator.generate(this.dims, this.dims, this.dims ** 2)
                 gc.gameManager.createFromParameters(level, 1);
                 gc.transitions.transitionFade(gc.menuManager.randomMenu, gc.gameManager);
               });
    this.addChild(this.generate);
  }

  getHighScore(text, dimensions) {
    let str = dimensions + '' + dimensions;
    if (this.gc.store.get(str) === undefined) {
      text.text = "";
    } else {
      let best = this.gc.store.get(str).time;
      text.text = "Your Best: " + best/1000 + 's';
    }
  }
}
