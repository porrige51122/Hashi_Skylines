const Bridge = require('./Bridge.js');

module.exports = class Building extends PIXI.Container {
  constructor(gc, x, y, lenX, lenY, value) {
    super()
    this.gc = gc;
    let w = gc.width;
    let h = gc.height;
    this.xp = x;
    this.yp = y;
    let tiltAmount = 1;
    let indent = (y*((w * tiltAmount)/(lenX + 1))/lenY) - ((w/(lenX + 1))/2);
    this.posx = (x + 1) * (w/(lenX + 1)) + indent;
    this.posy = (y + 1) * (h/(lenY + 1));
    let a = w/lenX;
    let b = h/lenY;
    this.min = Math.min(a,b);
    this.value = value;
    this.current = 0;
    this.buildingNo = Math.floor(Math.random() * this.gc.assets.sprites.buildings.length)
    this.bridges = [];
    this.tintMaster = 0xFFFFFF
  }

  render() {
    this.removeChild(this.building, this.lights)
    this.building = new PIXI.Sprite(this.gc.assets.sprites.buildings[this.buildingNo]);
    this.lights = new PIXI.Sprite(this.gc.assets.sprites.lights[this.value]);
    this.lights.position.set(this.posx,this.posy);
    this.lights.anchor.set(0.5, 0)
    this.lights.scale.set((3 * this.min)/this.building.width);
    this.building.position.set(this.posx,this.posy);
    this.building.anchor.set(0.5, 0.25);
    this.building.scale.set(this.min/this.building.width);
    this.anchory = this.posy - (this.building.height/5)
    if (this.isComplete()) {
      this.tintMaster = this.gc.assets.colours.lightsCorrect;
    } else {
      this.tintMaster = 0xFFFFFF;
    }
    this.lights.tint = this.tintMaster;
    this.addChild(this.building, this.lights);
  }

  isComplete() {
    return this.value === this.current;
  }

  addBridge(other, parent) {
    let bridge;
    for (let i = 0; i < this.bridges.length; i++) {
      if ((this.bridges[i].b1 === this && this.bridges[i].b2 === other)
          || (this.bridges[i].b2 === this && this.bridges[i].b1 === other)) {
        bridge = this.bridges[i];
      }
    }
    if (bridge === undefined || bridge.amount === 0) {

      let bridge = new Bridge(this.gc, this, other);
      if (!parent.canPlaceBridge(bridge)) {
        return;
      }
      this.current++;
      other.current++;
      this.render();
      other.render();
      bridge.buttonMode = bridge.interactive = true;
      bridge.on('mouseover', () => {
        bridge.selectorAlpha = 0.5;
        bridge.render()
      }).on('mouseout', () => {
        bridge.selectorAlpha = 0.01;
        bridge.render()
      }).on('mouseup', () => {
        if (!bridge.decrease()) {
          parent.removeChild(bridge);
        }
        this.current--;
        other.current--;
        this.render();
        other.render();
      })
      this.bridges.push(bridge);
      other.bridges.push(bridge);
      parent.bridges.push(bridge);
      parent.addChild(bridge);
      parent.checkComplete();
    } else {
      if (bridge.increase()) {
        this.current++;
        other.current++;
        parent.checkComplete();
      }
      this.render();
      other.render();
    }
  }
}
