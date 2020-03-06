const prim = (grid, rows, columns) => {
  let addedWalls = [];
  let removedWalls = [];
  let open = {};
  let frontier = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i % 2 === 0 || j % 2 === 0) {
      } else open[getKey(i, j)] = grid[i][j];
      grid[i][j].isWall = true;
      addedWalls.push(grid[i][j]);
    }
  }
  const f = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2]
  ];
  const n = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  const start = open[randomKey(open)];
  grid[start.row][start.col].isWall = false;
  removedWalls.push(grid[start.row][start.col]);
  f.forEach(i => {
    const r = start.row + i[0];
    const c = start.col + i[1];
    if (
      grid[r] &&
      grid[r][c] &&
      grid[r][c].isWall &&
      r !== 0 &&
      c !== 0 &&
      r !== rows - 1 &&
      c !== columns - 1
    )
      frontier[getKey(r, c)] = grid[r][c];
  });

  while (Object.keys(frontier).length) {
    const randFKey = randomKey(frontier);
    const { row, col } = frontier[randFKey];
    let neighbours = {};
    f.every((i, index) => {
      const r = row + i[0];
      const c = col + i[1];
      const wr = row + n[index][0];
      const wc = col + n[index][1];
      if (grid[r] && grid[r][c] && !grid[r][c].isWall) {
        neighbours[getKey(wr, wc)] = grid[wr][wc];
        //return false for skew towards start
        //return false;
      }
      return true;
    });
    const randNeighbour = neighbours[randomKey(neighbours)];
    grid[randNeighbour.row][randNeighbour.col].isWall = false;
    grid[frontier[randFKey].row][frontier[randFKey].col].isWall = false;
    removedWalls.push(grid[randNeighbour.row][randNeighbour.col]);
    removedWalls.push(grid[frontier[randFKey].row][frontier[randFKey].col]);
    f.forEach(i => {
      const r = frontier[randFKey].row + i[0];
      const c = frontier[randFKey].col + i[1];
      if (
        grid[r] &&
        grid[r][c] &&
        grid[r][c].isWall &&
        r !== 0 &&
        c !== 0 &&
        r !== rows - 1 &&
        c !== columns - 1
      )
        frontier[getKey(r, c)] = grid[r][c];
    });
    delete frontier[randFKey];
  }
  console.log(addedWalls.length);
  return { addedWalls, removedWalls, animAddedWalls: false };
};

const randomKey = obj => {
  var keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
};

const getKey = (i, j) => {
  return i.toString() + "-" + j.toString();
};

export default prim;
