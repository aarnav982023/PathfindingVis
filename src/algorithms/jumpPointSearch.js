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
  //grid[startNode.row][startNode.column].isWall = false;
  //grid[endNode.row][endNode.column].isWall = false;
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
    //grid[startNode.row][startNode.column].prevNode[d[0]][d[1]] = null;
  });
  while (pq.length) {
    const obj = pq.dequeue();
    if (!obj.node.isVisited) {
      obj.node.isVisited = true;
      visitedNodes.push(obj.node);
    }
    /*console.log(
      obj.node.row + "," + obj.node.col + "-dir:" + obj.dir + "-f:" + obj.node.f
    );*/
    const response = scan(obj.node, obj.dir, grid, endNode, pq);
    if (response === "found") {
      break;
    }
  }
  shortestPath = getShortestPath(grid[endNode.row][endNode.column]);
  return { visitedNodes, shortestPath };
};
//x = c // y = r
//hor = y // ver = x
const scan = (node, dir, grid, endNode, pq) => {
  const x = dir[0];
  const y = dir[1];
  if (x !== 0 && y !== 0) {
    let r0 = node.row;
    let c0 = node.col;
    while (true) {
      //console.log("diag");
      //console.log(r0, c0);
      let c1 = c0 + y;
      let r1 = r0 + x;
      if (!inGrid(r1, c1, grid)) return false;
      let g = grid[r1][c1];
      let ng = grid[r0][c0].g + 1;
      let nf = ng + H(r1, c1, endNode);
      if (g.f <= nf) return false;
      g.g = ng;
      g.f = nf;
      if (g.row === endNode.row && g.col === endNode.column) {
        grid[r1][c1].prevNode = grid[r0][c0];
        return "found";
      }
      if (g.isWall) return false;
      grid[r1][c1].prevNode = grid[r0][c0];
      let c2 = c1 + y;
      let r2 = r1 + x;
      let jump = false;
      if (
        inGrid(r1, c0, grid) &&
        grid[r1][c0].isWall &&
        inGrid(r2, c0, grid) &&
        (!grid[r2][c0].isWall || (r2 === endNode.row && c0 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c1], dir: [x, -y] });
        jump = true;
      }
      if (
        inGrid(r0, c1, grid) &&
        grid[r0][c1].isWall &&
        inGrid(r0, c2, grid) &&
        (!grid[r0][c2].isWall || (r0 === endNode.row && c2 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c1], dir: [-x, y] });
        jump = true;
      }
      let hor = scan(grid[r1][c1], [0, y], grid, endNode, pq);
      let ver = scan(grid[r1][c1], [x, 0], grid, endNode, pq);
      if (hor === "found" || ver === "found") return "found";
      if (hor || ver) {
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r1][c1], dir: [x, y] });
        return true;
      }
      c0 = c1;
      r0 = r1;
    }
  } else if (x === 0) {
    let r0 = node.row;
    let c0 = node.col;
    while (true) {
      //console.log("row");
      //console.log(r0, c0);
      let c1 = c0 + y;
      if (!inGrid(r0, c1, grid)) return false;
      let g = grid[r0][c1];
      let ng = grid[r0][c0].g + 1;
      let nf = ng + H(r0, c1, endNode);
      if (g.f <= nf) return false;
      g.g = ng;
      g.f = nf;
      if (g.row === endNode.row && g.col === endNode.column) {
        grid[r0][c1].prevNode = grid[r0][c0];
        return "found";
      }
      if (g.isWall) return false;
      grid[r0][c1].prevNode = grid[r0][c0];
      let c2 = c1 + y;
      let jump = false;
      if (
        inGrid(r0 - 1, c1, grid) &&
        grid[r0 - 1][c1].isWall &&
        inGrid(r0 - 1, c2, grid) &&
        (!grid[r0 - 1][c2].isWall ||
          (r0 - 1 === endNode.row && c2 === endNode.column))
      ) {
        pq.queue({ node: grid[r0][c1], dir: [-1, y] });
        jump = true;
      }
      if (
        inGrid(r0 + 1, c1, grid) &&
        grid[r0 + 1][c1].isWall &&
        inGrid(r0 + 1, c2, grid) &&
        (!grid[r0 + 1][c2].isWall ||
          (r0 + 1 === endNode.row && c2 === endNode.column))
      ) {
        pq.queue({ node: grid[r0][c1], dir: [1, y] });
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r0][c1], dir: [0, y] });
        return true;
      }
      c0 = c1;
    }
  } else if (y === 0) {
    let r0 = node.row;
    let c0 = node.col;
    while (true) {
      //console.log("col");
      //console.log(r0, c0);
      let r1 = r0 + x;
      if (!inGrid(r1, c0, grid)) return false;
      let g = grid[r1][c0];
      let ng = grid[r0][c0].g + 1;
      let nf = ng + H(r1, c0, endNode);
      if (g.f <= nf) return false;
      g.g = ng;
      g.f = nf;
      if (g.row === endNode.row && g.col === endNode.column) {
        grid[r1][c0].prevNode = grid[r0][c0];
        return "found";
      }
      if (g.isWall) return false;
      grid[r1][c0].prevNode = grid[r0][c0];
      let r2 = r1 + x;
      let jump = false;
      if (
        inGrid(r1, c0 - 1, grid) &&
        grid[r1][c0 - 1].isWall &&
        inGrid(r2, c0 - 1, grid) &&
        (!grid[r2][c0 - 1].isWall ||
          (r2 === endNode.row && c0 - 1 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c0], dir: [x, -1] });
        jump = true;
      }
      if (
        inGrid(r1, c0 + 1, grid) &&
        grid[r1][c0 + 1].isWall &&
        inGrid(r2, c0 + 1, grid) &&
        (!grid[r2][c0 + 1].isWall ||
          (r2 === endNode.row && c0 + 1 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c0], dir: [x, 1] });
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r1][c0], dir: [x, y] });
        return true;
      }
      r0 = r1;
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
  let ans = d * Math.sqrt(dx * dx + dy * dy);
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
