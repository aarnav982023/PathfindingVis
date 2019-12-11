const dijkstra = (grid, startNode, endNode) => {
  let dGrid = grid.map(row => row.map(node => (node.distance = 2)));
  console.log(dGrid);
};

export default dijkstra;
