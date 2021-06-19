const KeyboardInput = require('../../core/interface.js');
const Solver        = require('../../core/components/Solver.js');

module.exports = class CreatorMenu extends PIXI.Container {
  constructor(gc) {
    super();
    let w = gc.width;
    let h = gc.height;
    this.w = w;
    this.h = h;

    this.title = new PIXI.Container();
    let text = new PIXI.Text("Level Designer");
    text.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: w/16,
      fill: 0xFFFFFF
    })
    text.anchor.set(0.5,0)
    text.position.set(w/2,0);
    this.title.addChild(text);
    this.addChild(this.title);
    this.solution = [];

    this.back = gc.helpers.addButton(w/50,(8*h)/9, "Back", w/30, w/8, w/25, true);
    this.back.on('pointertap', () => {
                 gc.transitions.transitionFade(gc.menuManager.creatorMenu, gc.menuManager.mainMenu);
               });
    this.addChild(this.back);

    this.incrementer = gc.helpers.incrementer2(w/15,"Size", 8, 5, 20);
    this.incrementer.position.set(w/16, h/4);
    this.incrementer.scale.set(0.75);
    this.incrementer.children[0].on('pointertap', () => {
      this.removeSolutionText()
      this.removeChild(this.grid);
      this.grid = this.drawGrid(w/2, (5*h)/8, this.incrementer.children[2].val,this.incrementer.children[2].val, w/(this.incrementer.children[2].val * 3.5));
      this.addChild(this.grid);
    })
    this.incrementer.children[1].on('pointertap', () => {
      this.removeSolutionText()
      this.removeChild(this.grid);
      this.grid = this.drawGrid(w/2, (5*h)/8, this.incrementer.children[2].val,this.incrementer.children[2].val, w/(this.incrementer.children[2].val * 3.5));
      this.addChild(this.grid);
    })
    this.addChild(this.incrementer);

    this.grid = this.drawGrid(w/2, (5*h)/8, 8,8, w/(3.5 * 8));
    this.addChild(this.grid);

    this.solveButton = gc.helpers.addButton((w*7)/8, (5*h)/8, "Solve", w/30, w/7, w/25, false);
    this.solveButton.on('pointertap', () => {
      let level = [];
      let len = Math.pow(this.nodes.length, 0.5);
      for (let i = 0; i < this.nodes.length; i++) {
        let cur = this.nodes[i];
        if (cur.children[1].text !== "0")
          level.push([Math.floor(i/len), i % len, parseInt(cur.children[1].text)])
      }
      if (level.length >= 2) {
        this.solver = new Solver(this.incrementer.children[2].text, this.incrementer.children[2].text, level)
        let output = this.solver.search();
        if (output === 1) {
          this.solveText[0].visible = true;
          this.removeSolution()
          this.solution = this.solver.grid.bridges.bridges;
        } else {
          this.solveText[1].visible = true;
          this.removeSolution()
          this.solution = [];
        }
      }
    })

    this.solveText = [];
    let solFound = gc.helpers.addButton((w*6.8)/8, (11*h)/16, "Solution Found \nClick to view", w/60, w/7, w/25, false);
    solFound.children[1].style.fill = 0x00FF00;
    solFound.on('pointertap', () => {
      // TODO: Remove this when completed double lines on creator menu
      console.log(this.solver.toString());
      this.drawSolution();
    })
    this.solveText.push(solFound);
    let solNotFound = gc.helpers.addButton((w*6.8)/8, (11*h)/16, "Solution Not \nFound", w/60, w/7, w/25, false);
    solNotFound.children[1].style.fill = 0xFF0000;
    solNotFound.removeAllListeners();
    this.solveText.push(solNotFound);
    this.removeSolutionText();
    this.addChild(this.solveText[0], this.solveText[1])


    this.playButton = gc.helpers.addButton((w *7)/8, (6*h)/8, "Play", w/30, w/8, w/25, false);
    this.playButton.on('pointertap', () => {
      let len = Math.pow(this.nodes.length, 0.5);
      let level = [];
      for (let x = 0; x < len; x++) {
        let row = [];
        for (let y = 0; y < len; y++) {
          row.push(parseInt(this.nodes[(y * len) + x].children[1].text));
        }
        level.push(row);
      }
      gc.gameManager.createFromParameters(level, 2);
      gc.transitions.transitionFade(gc.menuManager.creatorMenu, gc.gameManager);
    })
    this.addChild(this.playButton, this.solveButton);
    this.startKeyboard();
  }

  removeSolution() {
    if (this.solutionBridges === undefined) {
      this.solutionBridges = [];
    }
    for (let i = 0; i < this.solutionBridges.length; i++) {
      this.removeChild(this.solutionBridges[i]);
    }
  }

  drawSolution() {
    this.solutionBridges = [];
    for (let i = 0; i < this.solution.length; i++) {
      let line = new PIXI.Graphics();
      line.x1 = this.solution[i].island1.x * this.split;
      line.y1 = this.solution[i].island1.y * this.split;
      line.x2 = this.solution[i].island2.x * this.split - line.x1;
      line.y2 = this.solution[i].island2.y * this.split - line.y1;
      let check = false;
      let lineB;
      for (let j = 0; j < this.solutionBridges.length; j++) {
        if (this.solutionBridges[j].x1 === line.x1 && this.solutionBridges[j].x2 === line.x2 && this.solutionBridges[j].y1 === line.y1 && this.solutionBridges[j].y2 === line.y2){
          check = true;
          lineB = this.solutionBridges[j];
          break;
        }
      }
      if (check) {
        lineB.visible = false;
        line.position.set(line.x1 + this.gridxstart, line.y1 + this.gridystart);
        line.lineStyle(12, 0xFF0000)
            .moveTo(0, 0)
            .lineTo(line.x2, line.y2);
        this.addChild(line);
        let line2 = new PIXI.Graphics();
        line2.position.set(line.x1 + this.gridxstart, line.y1 + this.gridystart);
        line2.lineStyle(5, 0x161616)
            .moveTo(0, 0)
            .lineTo(line.x2, line.y2);
        this.addChild(line2);
        this.solutionBridges.push(line2);
      } else {
        line.position.set(line.x1 + this.gridxstart, line.y1 + this.gridystart);
        line.lineStyle(5, 0xFF0000)
            .moveTo(0, 0)
            .lineTo(line.x2, line.y2);
        this.addChild(line);
      }
      this.solutionBridges.push(line);
    }
  }

  removeSolutionText() {
    for (let i = 0; i < this.solveText.length; i++)
      this.solveText[i].visible = false;
    this.removeSolution()
  }

  startKeyboard() {
    this.input = new KeyboardInput();
    this.input.engine = this;

    this.input.n1.release = () => {
      if (this.selected)
        this.selected.children[1].text = 1
    }

    this.input.n2.release = () => {
      if (this.selected)
        this.selected.children[1].text = 2
    }

    this.input.n3.release = () => {
      if (this.selected)
        this.selected.children[1].text = 3
    }

    this.input.n4.release = () => {
      if (this.selected)
        this.selected.children[1].text = 4
    }

    this.input.n5.release = () => {
      if (this.selected)
        this.selected.children[1].text = 5
    }

    this.input.n6.release = () => {
      if (this.selected)
        this.selected.children[1].text = 6
    }

    this.input.n7.release = () => {
      if (this.selected)
        this.selected.children[1].text = 7
    }

    this.input.n8.release = () => {
      if (this.selected)
        this.selected.children[1].text = 8
    }

    this.input.bksp.release = () => {
      if (this.selected) {
        this.selected.children[1].text = 0
        this.selected.alpha = 0.001
      }
    }
  }

  drawGrid(x,y,qx,qy,split) {
    this.split = split;
    let extra = split/2;
    let container = new PIXI.Container();
    let x2 = x - ((split * qx) / 2)
    let y2 = y - ((split * qx) / 2)

    this.gridxstart = x2;
    this.gridystart = y2;
    let style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: extra,
      fill: 0xFFFFFF
    })
    for (let i = 0; i < qx; i++) {
      let a = new PIXI.Graphics();
      container.addChild(a);
      a.position.set(x2 + (i * split),y2 - (extra));

      a.lineStyle(1, 0xFFFFFF)
       .moveTo(0, 0)
       .lineTo(0, (qy - 1) * split + (2 * extra))
    }
    for (let i = 0; i < qx; i++) {
      let num = new PIXI.Text(i + 1);
      num.style = style;
      num.position.set(x2 + (i * split), y2 - (2*extra))
      num.anchor.set(0.5,1);
      container.addChild(num);
    }

    for (let i = 0; i < qy; i++) {
      let a = new PIXI.Graphics();
      container.addChild(a);
      a.position.set(x2 - (extra), y2 + (i * split));

      a.lineStyle(1, 0xFFFFFF)
       .moveTo(0, 0)
       .lineTo((qx - 1) * split + (2 * extra), 0)
    }
    for (let i = 0; i < qy; i++) {
      let num = new PIXI.Text(i + 1);
      num.style = style;
      num.position.set(x2 - (2*extra), y2 + (i * split))
      num.anchor.set(1,0.5);
      container.addChild(num);
    }
    // Draw the nodes
    this.nodes = []
    for (let amx = 0; amx < qx; amx++) {
      for (let amy = 0; amy < qy; amy++) {
        let node = new PIXI.Container();
        let circle = new PIXI.Graphics();
        circle.beginFill(0xFFFFFF);
        circle.lineStyle(2, 0x262626, 1);
        circle.drawCircle(x2 + (amx * split),y2 + (amy * split), (3*extra)/4);
        circle.endFill();
        let number = new PIXI.Text(0);
        number.style = new PIXI.TextStyle({
        fontFamily: 'Chakra Petch',
        fontSize:  split/2,
        fill: 0x000000
        })
        number.position.set(x2 + (amx * split),y2 + (amy * split));
        number.anchor.set(0.5,0.5);
        node.addChild(circle, number);
        node.buttonMode = node.interactive = true;
        node.alpha = 0.001;
        node.on('pointertap', () => {
          this.nodeSelect(node);
        })
        container.addChild(node);
        this.nodes.push(node);
      }
    }
    return container;
  }

  nodeSelect(node) {
    this.removeSolutionText()
    this.selected = node;
    node.alpha = 1;
  }
}
