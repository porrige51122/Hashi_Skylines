const Node = require('../../core/components/Node.js');
const Bridge = require('../../core/components/Bridge.js');

/**
 * Generates a random level using a self built algorithm.
 * @author Aidan Smithers
 */
module.exports = class Generator {
  /**
   * Makes the GameController variable accessible across all subclasses
   * @param gc Game Controller Class
   */
  constructor(gc) {
    this.w = gc.width;
    this.h = gc.height;
    this.bridges = [];
    this.nodes = [];
  }

  /**
   *
   * @param mX Width of the grid to create on
   * @param mY Height of the grid to create on
   * @param noi Number of islands. May not reach this number, lower numbers make easier levels.
   * @returns {[]} 2D array of integers from value 0-8 where 0 represents an empty slot
   */
  generate(mX, mY, noi) {
    this.nodes = [];
    this.bridges = [];
    let maxX = parseInt(mX);
    let maxY = parseInt(mY);
    // Creates the original node on the canvas at a random location.
    let a = new Node(Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY), 0, this.w, this.h, {w: maxX, h: maxY});
    this.nodes.push(a);

    let errorCount = 2500;
    let numOfIslands = parseInt(noi);
    // Loops numOfIsland times and attempts to add a new node.
    // If the attempt fails, reduce the error count, If the error count hits zero,
    // the loop ends. This prevents this loop from being endless.
    for (let i = 0; i < numOfIslands - 1; i++) {
      if (errorCount < 0) break;
      // Pick a random placed node to be the master node.
      let masterNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];

      // Create a new node of a random distance either vertically or horizontally from masterNode
      let newNode
      if (Math.random() < 0.5) {
        let xdis = Math.floor(Math.random() * maxX);
        newNode = new Node(xdis, masterNode.y, 0, this.w, this.h, {w: maxX, h: maxY});
      } else {
        let ydis = Math.floor(Math.random() * maxY);
        newNode = new Node(masterNode.x , ydis, 0, this.w, this.h, {w: maxX, h: maxY});
      }

      // newNode cannot be on any other node
      let check = false;
      for (let j = 0; j < this.nodes.length; j++) {
        if (this.nodes[j].x === newNode.x && this.nodes[j].y === newNode.y) {
          check = true;
          break;
        }
      }
      if (check) {
        errorCount--;
        i--;
        continue;
      }

      // Checks if two bridges cross
      let b = new Bridge(masterNode, newNode, this.w, this.h);
      for (let j = 0; j < this.bridges.length; j++) {
        let curBridge = this.bridges[j];
        if (curBridge.node1 === masterNode || curBridge.node2 === masterNode) {
          continue;
        }
        if (!((curBridge.x1 === curBridge.x2 && b.y1 === b.y2) || (curBridge.y1 === curBridge.y2 && b.x1 === b.x2))) {
          continue;
        }
        let ta,tb;
        if (curBridge.x1 === curBridge.x2) {
          ta = curBridge;
          tb = b;
        } else {
          tb = curBridge;
          ta = b;
        }
        // Checks if both nodes are between the X and Yvalues.
        if (ta.x1 >= tb.x1 && ta.x2 >= tb.x1
        &&  ta.x1 <= tb.x2 && ta.x2 <= tb.x2) {
          if (ta.y1 <= tb.y1 && ta.y2 >= tb.y1
          &&  ta.y1 <= tb.y2 && ta.y2 >= tb.y2) {
            check = true;
          }
        }
      }

      if (check) {
        errorCount--;
        i--;
        continue;
      }

      // Checks if there is a node between the bridge
      if (b.x1 === b.x2) {
        for (let j = 0; j < this.nodes.length; j++) {
          let curNode = this.nodes[j];
          if (b.x1 === curNode.x) {
            if (b.y1 < curNode.y && b.y2 > curNode.y) {
              check = true;
            }
          }
        }
      } else {
        for (let j = 0; j < this.nodes.length; j++) {
          let curNode = this.nodes[j];
          if (b.y1 === curNode.y) {
            if (b.x1 < curNode.x && b.x2 > curNode.x) {
              check = true;
            }
          }
        }
      }

      if (check) {
        errorCount--;
        i--;
        continue;
      }

      // Checks if newNode is between a bridge
      for (let j = 0; j < this.bridges.length; j++) {
        let curBridge = this.bridges[j]
        if (curBridge.x1 === curBridge.x2 && curBridge.x1 === newNode.x) {
          if (curBridge.y1 < newNode.y && curBridge.y2 > newNode.y) {
            check = true;
          }
        } else {
          if (curBridge.y1 === newNode.y) {
            if (curBridge.x1 < newNode.x && curBridge.x2 > newNode.x) {
              check = true;
            }
          }
        }
      }

      if (check) {
        errorCount--;
        i--;
        continue;
      }

      this.nodes.push(newNode);
      let amount = Math.random() > 0.5 ? 1 : 2;
      b.noOfBridges = amount;
      masterNode.bridges.push(b);
      masterNode.value += amount;
      newNode.bridges.push(b);
      newNode.value += amount;
      this.bridges.push(b);
    }

    let output = [];
    for (let i = 0; i < maxY; i++) {
      let j = [];
      for (let ii = 0; ii < maxX; ii++) {
        j.push(0)
      }
      output.push(j);
    }
    for (let i = 0; i < this.nodes.length; i++) {
      output[this.nodes[i].y][this.nodes[i].x] = this.nodes[i].value;
    }
    return output;
  }
}
