import PriorityQueue from "js-priority-queue";

const astar = (grid, startNode, endNode) => {
  let visitedNodes = [];
  let shortestPath = [];
  let pq = new PriorityQueue({
    comparator: function(a, b) {
      return a.f - b.f;
    }
  });
  grid.forEach(row => {
    row.forEach(node => {
      //g : distance
      node.g = Infinity;
      //h : heuristic
      node.h = Infinity;
      //f = g + h
      node.f = Infinity;
      node.prevNode = null;
    });
  });
  grid[startNode.row][startNode.column].g = 0;
  grid[startNode.row][startNode.column].h = 0;
  grid[startNode.row][startNode.column].f = 0;
  pq.queue(grid[startNode.row][startNode.column]);
  while (pq.length) {
    const node = pq.dequeue();
    const { row, col } = node;
    if (grid[row][col].isVisited) continue;
    if (node.row === endNode.row && node.col === endNode.column) {
      shortestPath = getShortestPath(node);
      break;
    }
    const n = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    for (let j = 0; j < n.length; j++) {
      const i = n[j];
      const r = row + i[0];
      const c = col + i[1];
      if (
        grid[r] &&
        grid[r][c] &&
        !grid[r][c].isVisited &&
        (!grid[r][c].isWall || (r === endNode.row && c === endNode.column))
      ) {
        let gNew = grid[row][col].g + 1;
        let hNew = calculateHeuristic(r, c, endNode);
        let fNew = gNew + hNew;
        if (grid[r][c].f === Infinity || grid[r][c].f > fNew) {
          grid[r][c].g = gNew;
          grid[r][c].h = hNew;
          grid[r][c].f = fNew;
          grid[r][c].prevNode = node;
          pq.queue(grid[r][c]);
        }
      }
    }
    grid[row][col].isVisited = true;
    visitedNodes.push(node);
  }
  return { visitedNodes, shortestPath };
};

const calculateHeuristic = (row, col, endNode) => {
  return Math.sqrt(
    (row - endNode.row) * (row - endNode.row) +
      (col - endNode.column) * (col - endNode.column)
  );
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

export default astar;
