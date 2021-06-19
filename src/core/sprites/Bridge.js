module.exports = class Bridge extends PIXI.Sprite {
  constructor(gc, b1, b2) {
    super();
    this.gc = gc;
    if (b1.xp < b2.xp || b1.yp < b2.yp) {
      this.b1 = b1;
      this.b2 = b2;
    } else {
      this.b2 = b1;
      this.b1 = b2;
    }
    this.thickness = 1;
    this.borderthickness = 2;
    this.removethickness = 4;
    this.draw1();
    this.amount = 1;

    this.selectorAlpha = 0.01
    this.render();
    let a = this.b2.posx - this.b1.posx
    let b = this.b2.anchory - this.b1.anchory
    let c = (Math.abs(a) + Math.pow(Math.abs(b), 1.2)) / 7;
    let startx = this.b1.posx;
    let starty = this.b1.anchory;
    let endx = this.b2.posx;
    let endy = this.b2.anchory;
    this.hitArea = new PIXI.Polygon(startx,starty,startx,starty + 5,(startx + endx)/2,((starty + endy)/2)+c,endx,endy+5, endx, endy,startx,starty)
  }

  isVertical() {
    return this.b1.xp == this.b2.xp;
  }

  crosses(other) {
    if (this.isVertical() && other.isVertical()) {
      return false;
    }
    // a = the vertical one
    // b = the horizontal one
    let a = this.isVertical() ? this : other;
    let b = this.isVertical() ? other : this;
    /**
     *          a.b1
     *           |
     *  b.b1 ---------- b.b2
     *           |
     *          a.b2
     */
    if (b.b1.xp < a.b1.xp && b.b2.xp > a.b1.xp) { // x check
      if (b.b1.yp > a.b1.yp && b.b1.yp < a.b2.yp) { // y check
        return true;
      }
    }
    return false;
  }

  increase() {
    if (this.amount == 1) {
      this.amount++
      this.render()
      return true;
    }
    return false;
  }

  decrease() {
    if (this.amount == 2) {
      this.amount--
      this.render()
      return true;
    } else if (this.amount == 1) {
      this.amount--;
      this.render();
    }
    return false;
  }

  render() {
    this.removeChildren()
    if (this.amount == 2) {
      this.colour = this.gc.assets.colours.doubleWire;
      this.draw1();
      this.draw2();
    } else if (this.amount == 1) {
    this.colour =  this.gc.assets.colours.singleWire;
      this.draw1();
    }
  }

  draw1(selectorAlpha) {
    this.drawCurve(this.line1, this.border1, 1.15, 10, this.selector1)
  }

  draw2(selectorAlpha) {
    this.drawCurve(this.line2, this.border2, 1.2, 7, this.selector2)
  }

  drawCurve(line, border, strenA, strenB, selector, selectorAlpha) {
    line = new PIXI.Graphics();
    border = new PIXI.Graphics();
    selector = new PIXI.Graphics();
    line.position.set(this.b1.posx, this.b1.anchory);
    border.position.set(this.b1.posx, this.b1.anchory);
    selector.position.set(this.b1.posx, this.b1.anchory);
    let lineendx = this.b2.posx - this.b1.posx;
    let lineendy = this.b2.anchory - this.b1.anchory;
    let stren = (Math.abs(lineendx) + Math.pow(Math.abs(lineendy), strenA)) / strenB;

    let curvex = (lineendx/2);
    let curvey = (lineendy/2) + stren;
    border.lineStyle(this.thickness + (2 * this.borderthickness), 0x000000)
       .moveTo(0, 0)
       .bezierCurveTo(curvex,curvey,curvex,curvey,lineendx, lineendy);
    selector.lineStyle(this.thickness + (2 * this.removethickness), 0xFFFFFF)
       .moveTo(0, 0)
       .bezierCurveTo(curvex,curvey,curvex,curvey,lineendx, lineendy);
    selector.alpha = this.selectorAlpha;
    line.lineStyle(this.thickness, this.colour)
       .moveTo(0, 0)
       .bezierCurveTo(curvex,curvey,curvex,curvey,lineendx, lineendy);
    this.addChild(selector, border, line);
  }
}
