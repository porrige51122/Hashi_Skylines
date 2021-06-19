/**
 * Represents all the drawing and basic low level functions of the bridges between nodes.
 */
module.exports = class Bridge {
  constructor(node1, node2, w, h) {
    this.w = w;
    this.h = h;
    this.buffer = this.w/120;
    // Makes sure the lowest x/the lowest y value is always node1. This helps all future functions and preventing checks
    if (node1.x < node2.x || node1.y < node2.y) {
      this.node1 = node1;
      this.node2 = node2;
    } else {
      this.node2 = node1;
      this.node1 = node2;
    }
    // Array to store bridges that intersect this bridge.
    this.intersects = [];
    // values needed for reducing line size.
    this.x1 = this.node1.x;
    this.y1 = this.node1.y;
    this.x2 = this.node2.x;
    this.y2 = this.node2.y;

    // Number of bridges that are connected, can be either 0, 1, or 2
    this.noOfBridges = 0;
  }

  // Updates the number of bridges connected.
  update() {

  }
}
