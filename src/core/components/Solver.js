/**
 * Original Design from:
 * https://github.com/amtseng/bridges_solver
 * Rewritten for JavaScript by Aidan Smithers
 */

module.exports = class Solver {
  constructor(width, height, islandList) {
    this.width = width;
    this.height = height;
    this.grid = new Grid(width, height);
    for (let i = 0; i < islandList.length; i++) {
      this.grid.addIsland(islandList[i][0], islandList[i][1], islandList[i][2]);
    }
    this.grid.updateNeighbors();
  }

  search() {
    let status = this.grid.status();
    if (status == 1) {
      return 1;
    }
    if (status == -1) {
      return -1;
    }

    let logicBridges = this.logic();
    let lastLogicRound = [...logicBridges];
    while (lastLogicRound.length != 0) {
      lastLogicRound = this.logic();
      logicBridges.push(...lastLogicRound);
    }

    if (this.grid.status() == 1) {
      return 1;
    }
    let vBridges = this.grid.validBridges();
    for (let i = 0; i < vBridges.length; i++) {
      this.grid.addBridge(vBridges[i]);
      let result = this.search()
      if (result == -1) {
        this.grid.deleteBridge(vBridges[i]);
      } else if (result == 1) {
        return 1;
      }
    }

    for (let i = 0; i < logicBridges.length; i++) {
      this.grid.deleteBridge(logicBridges[i]);
    }
    return -1;
  }

  logic() {
    let logicBridges = [];
    for (let i = 0; i < this.grid.islands.islands.length; i++) {
      let vBridges = this.grid.validBridges();
      let potentialBridges = vBridges.filter(bridge => ((bridge.island1.equals(this.grid.islands.islands[i])) || (bridge.island2.equals(this.grid.islands.islands[i]))));
      let avaliableDirections = potentialBridges.length;
      let avaliableConnections = 0;
      let singlyRestrictedTempBridges = []; // Bridges that cannot be made twice
      let tempBridges = [];

      for (let j = 0; j < this.grid.islands.islands[i].neighbors.length; j++) {
        let b = new Bridge(this.grid.islands.islands[i].neighbors[j], this.grid.islands.islands[i]);
        let contains = false;
        for (let k = 0; k < potentialBridges.length; k++) {
          if (potentialBridges[k].equals(b)) {
            contains = true;
          }
        }
        if (contains) {
          if (this.grid.islands.islands[i].neighbors[j].capacity == 1) {
            avaliableConnections += 1;
            tempBridges.push(b);
            singlyRestrictedTempBridges.push(b);
          } else if (this.grid.islands.islands[i].neighbors[j].capacity >= 2) {
            avaliableConnections += 2;
            tempBridges.push(b);
            tempBridges.push(b);
          }
        }
      }

      if (avaliableConnections == this.grid.islands.islands[i].capacity) {
        for (let k = 0; k < tempBridges.length; k++) {
          this.grid.addBridge(tempBridges[k]);
          logicBridges.push(tempBridges[k]);
        }
      } else if (this.grid.islands.islands[i].capacity > (2 * (avaliableDirections - 1))) {
        for (let k = 0; k < potentialBridges.length; k++) {
          this.grid.addBridge(potentialBridges[k]);
          logicBridges.push(potentialBridges[k]);
        }
      } else if ((this.grid.islands.islands[i].capacity - singlyRestrictedTempBridges.length) > (2 * (avaliableDirections - singlyRestrictedTempBridges.length - 1))) {
        for (let k = 0; k < potentialBridges.length; k++) {
          let contains = false;
          for (let l = 0; l < singlyRestrictedTempBridges.length; l++) {
            if (potentialBridges[k].equals(singlyRestrictedTempBridges[l])) {
              contains = true;
            }
          }
          if (!contains) {
            this.grid.addBridge(potentialBridges[k]);
            logicBridges.push(potentialBridges[k]);
          }
        }
      }
    }
    return logicBridges;
  }

  toString() {
    let grid = [];
    for (let i = 0; i < parseInt(this.width); i++) {
      let temp = [];
      for (let j = 0; j < parseInt(this.height); j++) {
        temp.push(" ");
      }
      grid.push(temp);
    }
    for (let i = 0; i < this.grid.islands.islands.length; i++) {
      grid[this.grid.islands.islands[i].x][this.grid.islands.islands[i].y] = this.grid.islands.islands[i].originalCapacity;
    }

    for (let i = 0; i < this.grid.bridges.bridges.length; i++) {
      let cur = this.grid.bridges.bridges[i];
      let char;
      if (cur.orientation === 1) {
        if (grid[cur.island1.x][cur.island1.y + 1] === " ")
          char = "|";
        else if (grid[cur.island1.x][cur.island1.y + 1] === "|")
          char = "#";
        else
          char = "X";

        for (let j = cur.island1.y + 1; j < cur.island2.y; j++) {
          grid[cur.island1.x][j] = char;
        }
      } else {
        if (grid[cur.island1.x + 1][cur.island1.y] === " ")
          char = "-";
        else if (grid[cur.island1.x + 1][cur.island1.y] === "-")
          char = "=";
        else
          char = "X";

        for (let j = cur.island1.x + 1; j < cur.island2.x; j++) {
          grid[j][cur.island1.y] = char;
        }
      }
    }

    let result = "";
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        result += " " + grid[j][i];
      }
      result += "\n"
    }
    return result;
  }
}

class Bridge {
  constructor(island1, island2) {
    // Orientation 1 == vertical, -1 == horizontal
    this.orientation = island1.x === island2.x ? 1 : -1;

    if (this.orientation === 1) {
      if (island1.y < island2.y) {
        this.island1 = island1;
        this.island2 = island2;
      } else {
        this.island1 = island2;
        this.island2 = island1;
      }
    } else {
      if (island1.x < island2.x) {
        this.island1 = island1;
        this.island2 = island2;
      } else {
        this.island1 = island2;
        this.island2 = island1;
      }
    }

  }

  intersects(other) {
    if (this.orientation === other.orientation) {
      return false;
    }

    if (this.orientation === 1) {
      return ((other.island1.y > this.island1.y) &&
        (other.island1.y < this.island2.y) &&
        (this.island1.x > other.island1.x) &&
        (this.island1.x < other.island2.x))
    } else {
      return ((this.island1.y > other.island1.y) &&
        (this.island1.y < other.island2.y) &&
        (other.island1.x > this.island1.x) &&
        (other.island1.x < this.island2.x))
    }
  }

  equals(other) {
    if (other !== undefined) {
      return (this.island1.equals(other.island1) && (this.island2.equals(other.island2)));
    }
    return false;
  }

  toString() {
    return "(" + this.island1.x + "," + this.island1.y + ")--(" + this.island2.x + "," + this.island2.y + ")";
  }
}

class BridgeList {
  constructor() {
    this.bridges = [];
  }

  addBridge(bridge) {
    this.bridges.push(bridge);
  }

  deleteBridge(bridge) {
    for (let i = 0; i < this.bridges.length; i++) {
      if (this.bridges[i].equals(bridge)) {
        this.bridges.splice(i,1);
        return;
      }
    }
  }

  conflict(potentialBridge) {
    for (let i = 0; i < this.bridges.length; i++) {
      if (this.bridges[i].intersects(potentialBridge)) {
        return true;
      }
    }
    return false;
  }
}

class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.islands = new IslandList();
    this.bridges = new BridgeList();
  }

  addIsland(x, y, capacity) {
    let island = new Island(x, y, capacity);
    this.islands.addIsland(island);
  }

  updateNeighbors() {
    for (let i = 0; i < this.islands.islands.length; i++) {
      let x = this.islands.islands[i].x;
      let y = this.islands.islands[i].y;

      // West:
      let j = x - 1;
      while (j >= 0) {
        let br = this.checkdir(x, y, j, i, true)
        if (br) break;
        j--;
      }

      // East:
      j = x + 1;
      while (j < this.width) {
        let br = this.checkdir(x, y, j, i, true)
        if (br) break;
        j++;
      }

      // North:
      j = y - 1;
      while (j >= 0) {
        let br = this.checkdir(x, y, j, i, false)
        if (br) break;
        j--;
      }

      // South:
      j = y + 1;
      while (j < this.height) {
        let br = this.checkdir(x, y, j, i, false)
        if (br) break;
        j++;
      }

    }
  }

  checkdir(x, y, j, i, horizontal) {
    let neighbor = horizontal ? this.islands.getIsland(j, y) : this.islands.getIsland(x, j);
    if (neighbor) {
      let includes = false;
      for (let a = 0; a < this.islands.islands[i].neighbors.length; a++) {
        if (this.islands.islands[i].neighbors[a].equals(neighbor)) {
          includes = true;
        }
      }
      if (!includes) {
        this.islands.islands[i].addNeighbor(neighbor);
      }

      includes = false;
      for (let a = 0; a < neighbor.neighbors.length; a++) {
        if (neighbor.neighbors[a].equals(this.islands.islands[i])) {
          includes = true;
        }
      }
      if (!includes) {
        neighbor.addNeighbor(this.islands.islands[i])
      }
      return true;
    }
    return false;
  }

  addBridge(bridge) {
    this.bridges.addBridge(bridge);
    bridge.island1.addBridge(bridge);
    bridge.island2.addBridge(bridge);
  }

  deleteBridge(bridge) {
    this.bridges.deleteBridge(bridge);
    bridge.island1.deleteBridge(bridge);
    bridge.island2.deleteBridge(bridge);
  }

  validBridges() {
    let vBridges = [];
    for (let i = 0; i < this.islands.islands.length; i++) {
      if (this.islands.islands[i].complete()) {
        continue;
      }
      for (let j = 0; j < this.islands.islands[i].neighbors.length; j++) {
        let potentialBridge = new Bridge(this.islands.islands[i], this.islands.islands[i].neighbors[j]);
        if (!this.islands.islands[i].neighbors[j].complete() && this.islands.islands[i].bridgesTo(this.islands.islands[i].neighbors[j]) < 2) {
          let includes = false;
          for (let k = 0; k < vBridges.length; k++) {
            if (vBridges[k].equals(potentialBridge)) {
              includes = true;
            }
          }
          if (!this.bridges.conflict(potentialBridge) && !(includes)) {
            vBridges.push(potentialBridge);
          }
        }
      }
    }
    return vBridges;
  }

  dfs(island) {
    island.visited = true;
    for (let i = 0; i < island.bridges.length; i++) {
      let connectedNeighbor;
      if (island.bridges[i].island1 == island) {
        connectedNeighbor = island.bridges[i].island2;
      } else {
        connectedNeighbor = island.bridges[i].island1;
      }
      if (!connectedNeighbor.visited) {
        this.dfs(connectedNeighbor);
      }
    }
  }

  statusHelper() {
    // TODO: UPDATE THIS TO USE SETS (O(n^2) -> O(n))
    for (let i = 0; i < this.bridges.bridges.length; i++) {
      let count = 0;
      for (let j = i + 1; j < this.bridges.bridges.length; j++) {
        if (this.bridges.bridges[i].equals(this.bridges.bridges[j])) {
          count++;
        }
      }
      if (count > 2) {
        return -1;
      }
    }

    for (let i = 0; i < this.islands.islands.length; i++) {
      let potentialBridgeNum = 0;
      for (let j = 0; j < this.islands.islands[i].neighbors.length; j++) {
        if (!(this.bridges.conflict(new Bridge(this.islands.islands[i], this.islands.islands[i].neighbors[j])))) {
          potentialBridgeNum += this.islands.islands[i].neighbors[j].capacity;
        }
      }
      if (potentialBridgeNum < this.islands.islands[i].capacity || this.islands.islands[i].capacity < 0) {
        return -1; // Incorrect
      }
      if (this.islands.islands[i].capacity != 0) {
        return 0; // Incomplete
      }
    }
    return 1; // Correct
  }

  status() {
    let x = this.statusHelper();
    if (x == 1) {
      this.islands.setAllUnvisited();
      this.dfs(this.islands.islands[0]);
      if (this.islands.existsUnvisited()) {
        return -1;
      }
    }
    return x;
  }
}

/**
 * Island Class
 * Object containing abstracting all methods of the islands within a
 * Hashi Puzzle.
 * @version 1.0
 */
class Island {
  /**
   * @param x X coordinate of the Island
   * @param y Y coordinate of the Island
   * @param capacity The Capacity of the Island
   */
  constructor(x, y, capacity) {
    this.x = x;
    this.y = y;
    this.capacity = capacity;
    this.originalCapacity = capacity;
    this.neighbors = [];
    this.bridges = [];
    this.visited = false;
  }

  neighborNum() {
    var count = 0;
    for (let i = 0; i < this.neighbors.length; i++) {
      if (this.neighbors[i] !== undefined) {
        count++;
      }
    }
    return count;
  }

  bridgeNum() {
    return this.bridges.length;
  }

  complete() {
    return this.capacity == 0;
  }

  addNeighbor(island) {
    this.neighbors.push(island);
  }

  bridgesTo(neighbor) {
    // Count number of bridges already made with neighbor
    let bridge = new Bridge(this, neighbor);
    let count = 0;
    for (let i = 0; i < this.bridges.length; i++) {
      if (this.bridges[i].equals(bridge)) {
        count++;
      }
    }
    return count;
  }

  addBridge(bridge) {
    this.bridges.push(bridge);
    this.capacity--;
  }

  deleteBridge(bridge) {
    for (let i = 0; i < this.bridges.length; i++) {
      if (this.bridges[i].equals(bridge)) {
        this.bridges.splice(i,1);
        this.capacity++;
        return;
      }
    }
  }

  equals(other) {
    if (other !== undefined) {
      if ((this.x == other.x) && (this.y == other.y)) {
        return true;
      }
    }
    return false;
  }

  toString() {
    return "x:" + this.x + " y:" + this.y + " cap:" + this.capacity;
  }
}
class IslandList {
  constructor() {
    this.islands = [];
  }

  addIsland(island) {
    this.islands.push(island);
  }

  getIsland(x, y) {
    var compare = new Island(x, y, 0);
    for (let i = 0; i < this.islands.length; i++) {
      if (compare.equals(this.islands[i])) {
        return this.islands[i];
      }
    }
  }

  setAllUnvisited() {
    for (let i = 0; i < this.islands.length; i++) {
      this.islands[i].visited = false;
    }
  }

  existsUnvisited() {
    for (let i = 0; i < this.islands.length; i++) {
      if (!this.islands[i].visited) {
        return true;
      }
    }
    return false;
  }

  allComplete() {
    for (let island in islands) {
      if (!island.complete()) {
        return false;
      }
    }
    return true;
  }
}
