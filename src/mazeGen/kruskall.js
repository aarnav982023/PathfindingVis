import disjointSet from "disjoint-set";

const kruskal = (grid, rows, columns) => {
  const set = disjointSet();
  let edges = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i % 2 === 0 || j % 2 === 0) {
        grid[i][j].isWall = true;
        if (i !== 0 && j !== 0 && i !== rows - 1 && j !== columns - 1) {
          edges.push(grid[i][j]);
        }
      } else set.add(grid[i][j]);
    }
  }
  shuffle(edges);
  edges.forEach(edge => {
    if (
      edge.row % 2 !== 0 &&
      !set.connected(grid[edge.row][edge.col - 1], grid[edge.row][edge.col + 1])
    ) {
      set.union(grid[edge.row][edge.col - 1], grid[edge.row][edge.col + 1]);
      grid[edge.row][edge.col].isWall = false;
    }
    if (
      edge.col % 2 !== 0 &&
      !set.connected(grid[edge.row - 1][edge.col], grid[edge.row + 1][edge.col])
    ) {
      set.union(grid[edge.row - 1][edge.col], grid[edge.row + 1][edge.col]);
      grid[edge.row][edge.col].isWall = false;
    }
  });
};

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default kruskal;
