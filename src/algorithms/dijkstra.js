import PriorityQueue from "js-priority-queue";

const dijkstra = (grid, startNode, endNode) => {
  let visitedNodes = [];
  let shortestPath = [];
  let pq = new PriorityQueue({
    comparator: function(a, b) {
      return a.distance - b.distance;
    }
  });
  grid.forEach(row =>
    row.forEach(node => {
      if (node.row === startNode.row && node.col === startNode.column) {
        node.distance = 0;
      } else node.distance = Infinity;
      node.prevNode = null;
    })
  );
  pq.queue(grid[startNode.row][startNode.column]);
  while (pq.length) {
    let node = pq.dequeue();
    const { row, col } = node;
    if (grid[row][col].isVisited) continue;
    if (node.distance === Infinity) break;
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
    //with diag
    //n.push([-1, 1], [1, 1], [-1, -1], [1, -1]);
    n.forEach(i => {
      const r = row + i[0];
      const c = col + i[1];
      if (
        grid[r] &&
        grid[r][c] &&
        !grid[r][c].isVisited &&
        (!grid[r][c].isWall || (r === endNode.row && c === endNode.column))
      ) {
        const dist = Math.abs(i[0]) === 1 && Math.abs(i[1]) === 1 ? 1.4 : 1;
        if (node.distance + dist < grid[r][c].distance) {
          grid[r][c].prevNode = node;
          grid[r][c].distance = node.distance + dist;
        }
        pq.queue(grid[r][c]);
      }
    });
    grid[row][col].isVisited = true;
    visitedNodes.push(node);
  }
  return { visitedNodes, shortestPath };
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

export default dijkstra;
