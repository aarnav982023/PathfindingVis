import PriorityQueue from "js-priority-queue";

const jumpPointSearch = (grid, startNode, endNode) => {
  let visitedNodes = [];
  let shortestPath = [];
  let pq = new PriorityQueue({
    comparator: function(a, b) {
      return a.node.f - b.node.f;
    }
  });
  grid.forEach(row => {
    row.forEach(node => {
      //g : distance
      node.g = Infinity;
      //f = g + h
      node.f = Infinity;
      node.prevNode = null;
    });
  });
  grid[startNode.row][startNode.column].g = 0;
  grid[startNode.row][startNode.column].f = H(
    startNode.row,
    startNode.column,
    endNode
  );
  const n = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1]
  ];

  n.forEach(d => {
    pq.queue({ node: grid[startNode.row][startNode.column], dir: d });
  });
  while (pq.length) {
    const obj = pq.dequeue();
    /*if (!obj.node.isVisited) {
      obj.node.isVisited = true;
      visitedNodes.push(obj.node);
    }*/
    visitedNodes.push(obj.node);
    const response = scan(obj.node, obj.dir, grid, endNode, pq);
    console.log(response);
    if (response === "found") break;
  }
  shortestPath = getShortestPath(grid[endNode.row][endNode.column]);
  return { visitedNodes, shortestPath };
};

const scan = (node, dir, grid, endNode, pq) => {
  const x = dir[0];
  const y = dir[1];
  const r = node.row;
  const c = node.col;
  let r1 = r + x;
  let c1 = c + y;
  if (!inGrid(r1, c1, grid)) return false;
  if (r1 === endNode.row && c1 === endNode.column) return "found";
  if (grid[r1][c1].isWall) return false;
  grid[r1][c1].g = grid[r][c].g + 1;
  grid[r1][c1].f = grid[r1][c1].g + H(r1, c1, endNode);
  grid[r1][c1].prevNode = grid[r][c];
  if (Math.abs(x) === 1 && Math.abs(y) === 1) {
    while (true) {
      if (r1 === endNode.row && c1 === endNode.column) return "found";
      if (grid[r1][c1].isWall) return false;
      const h = scan(grid[r1][c1], [0, y], grid, endNode, pq);
      const v = scan(grid[r1][c1], [x, 0], grid, endNode, pq);
      if (h === "found" || v === "found") return "found";
      if (h || v) {
        pq.queue({ node: grid[r1][c1], dir: [x, y] });
        return true;
      }
      if (inGrid(r1 + x, c1 + y, grid)) {
        grid[r1 + x][c1 + y].g = grid[r1][c1].g + 1;
        grid[r1 + x][c1 + y].f =
          grid[r1 + x][c1 + y].g + H(r1 + x, c1 + y, endNode);
        grid[r1 + x][c1 + y].prevNode = grid[r1][c1];
        r1 += x;
        c1 += y;
      } else return false;
    }
  } else if (x === 0) {
    while (true) {
      if (r1 === endNode.row && c1 === endNode.column) return "found";
      if (grid[r1][c1].isWall) return false;
      let jump = false;
      if (r1 === endNode.row && c1 === endNode.column) return "found";
      if (
        inGrid(r1 + 1, c1, grid) &&
        grid[r1 + 1][c1].isWall &&
        inGrid(r1 + 1, c1 + y, grid) &&
        !grid[r1 + 1][c1 + y].isWall
      ) {
        pq.queue({ node: grid[r1][c1], dir: [1, y] });
        jump = true;
      }
      if (
        inGrid(r1 - 1, c1, grid) &&
        grid[r1 - 1][c1].isWall &&
        inGrid(r1 - 1, c1 + y, grid) &&
        !grid[r1 - 1][c1 + y].isWall
      ) {
        pq.queue({ node: grid[r1][c1], dir: [-1, y] });
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r1][c1], dir: [x, y] });
        return true;
      }
      if (inGrid(r1 + x, c1 + y, grid)) {
        grid[r1 + x][c1 + y].g = grid[r1][c1].g + 1;
        grid[r1 + x][c1 + y].f =
          grid[r1 + x][c1 + y].g + H(r1 + x, c1 + y, endNode);
        grid[r1 + x][c1 + y].prevNode = grid[r1][c1];
        r1 += x;
        c1 += y;
      } else return false;
    }
  } else if (y === 0) {
    while (true) {
      if (r1 === endNode.row && c1 === endNode.column) return "found";
      if (grid[r1][c1].isWall) return false;
      let jump = false;
      if (r1 === endNode.row && c1 === endNode.column) return "found";
      if (
        inGrid(r1, c1 + 1, grid) &&
        grid[r1][c1 + 1].isWall &&
        inGrid(r1 + x, c1 + 1, grid) &&
        !grid[r1 + x][c1 + 1].isWall
      ) {
        pq.queue({ node: grid[r1][c1], dir: [x, 1] });
        jump = true;
      }
      if (
        inGrid(r1, c1 - 1, grid) &&
        grid[r1][c1 - 1].isWall &&
        inGrid(r1 + x, c1 - 1, grid) &&
        !grid[r1 + x][c1 - 1].isWall
      ) {
        pq.queue({ node: grid[r1][c1], dir: [x, -1] });
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r1][c1], dir: [x, y] });
        return true;
      }
      if (inGrid(r1 + x, c1 + y, grid)) {
        grid[r1 + x][c1 + y].g = grid[r1][c1].g + 1;
        grid[r1 + x][c1 + y].f =
          grid[r1 + x][c1 + y].g + H(r1 + x, c1 + y, endNode);
        grid[r1 + x][c1 + y].prevNode = grid[r1][c1];
        r1 += x;
        c1 += y;
      } else return false;
    }
  }
};

const inGrid = (row, col, grid) => {
  return grid[row] && grid[row][col];
};

const H = (row, col, endNode) => {
  const dx = Math.abs(row - endNode.row);
  const dy = Math.abs(col - endNode.column);
  const d = 1;
  let ans;
  ans = d * (dx + dy);
  /*if (heuristic === "manhatten") {
      ans = d * (dx + dy);
    }
    if (heuristic === "euclidean") {
      ans = d * Math.sqrt(dx * dx + dy * dy);
    }
    if (heuristic === "octile" || heuristic === "chebyshev") {
      let d2 = diagDist;
      ans = d * Math.max(dx, dy) + (d2 - d) * Math.min(dx, dy);
    }*/
  return ans;
};

const getShortestPath = node => {
  let shortestPath = [];
  while (node !== null) {
    shortestPath.unshift(node);
    node = node.prevNode;
    if (node) node.isShortestPath = true;
  }
  return shortestPath;
};

export default jumpPointSearch;
