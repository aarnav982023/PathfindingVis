import PriorityQueue from "js-priority-queue";

const dijkstra = (grid, startNode, endNode) => {
  let visitedNodes = [];
  let pq = new PriorityQueue({
    comparator: function(a, b) {
      return a.distance - b.distance;
    }
  });
  grid.forEach(row =>
    row.forEach(node => {
      if (node.isStart) {
        node.distance = 0;
      } else node.distance = Infinity;
      node.isVisited = false;
    })
  );
  pq.queue(grid[startNode.row][startNode.column]);
  while (pq.length) {
    let node = pq.dequeue();
    const { row, col } = node;
    if (grid[row][col].isVisited) continue;
    if (node.distance === Infinity) break;
    if (node.isEnd) break;
    if (grid[row + 1] && grid[row + 1][col] && !grid[row + 1][col].isVisited) {
      grid[row + 1][col].distance =
        node.distance + 1 < grid[row + 1][col].distance
          ? node.distance + 1
          : grid[row + 1][col].distance;
      pq.queue(grid[row + 1][col]);
    }
    if (grid[row - 1] && grid[row - 1][col] && !grid[row - 1][col].isVisited) {
      grid[row - 1][col].distance =
        node.distance + 1 < grid[row - 1][col].distance
          ? node.distance + 1
          : grid[row - 1][col].distance;
      pq.queue(grid[row - 1][col]);
    }
    if (grid[row][col + 1] && !grid[row][col + 1].isVisited) {
      grid[row][col + 1].distance =
        node.distance + 1 < grid[row][col + 1].distance
          ? node.distance + 1
          : grid[row][col + 1].distance;
      pq.queue(grid[row][col + 1]);
    }
    if (grid[row][col - 1] && !grid[row][col - 1].isVisited) {
      grid[row][col - 1].distance =
        node.distance + 1 < grid[row][col - 1].distance
          ? node.distance + 1
          : grid[row][col - 1].distance;
      pq.queue(grid[row][col - 1]);
    }
    grid[row][col].isVisited = true;
    visitedNodes.push(node);
  }
  return visitedNodes;
};

export default dijkstra;
