
module.exports = class Node{
  constructor(x, y, value, w, h, dimensions) {
    this.dimensions = dimensions
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.connected = 0;
    this.bridges = [];
    this.complete = false;
    this.update();
  }

  getCurVal() {
    if (this.connected <= 0) {
      this.connected = 0;
    }
    return this.value - this.connected;
  }

  update() {

  }
}
