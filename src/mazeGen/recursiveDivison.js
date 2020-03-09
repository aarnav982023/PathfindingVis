const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";
let addedWalls = [];
let removedWalls = [];
const recursiveDivision = (grid, rows, columns) => {
  addedWalls = [];
  removedWalls = [];
  for (let i = 0; i < rows; i++) {
    grid[i][0].isWall = true;
    grid[rows - i - 1][columns - 1].isWall = true;
    addedWalls.push(grid[i][0]);
    addedWalls.push(grid[rows - i - 1][columns - 1]);
  }
  for (let j = 0; j < columns; j++) {
    grid[0][columns - j - 1].isWall = true;
    grid[rows - 1][j].isWall = true;
    addedWalls.push(grid[0][columns - j - 1]);
    addedWalls.push(grid[rows - 1][j]);
  }
  const width = columns;
  const height = rows;
  divide(grid, 0, 0, width, height, chooseOrientation(width, height));

  return { addedWalls, removedWalls, animAddedWalls: true };
};

const divide = (grid, x, y, width, height, orientation) => {
  if (height < 2 && width < 2) return;
  const horizontal = orientation === HORIZONTAL;
  let wx = x + (horizontal ? randEven(height - 2) : 0);
  let wy = y + (horizontal ? 0 : randEven(width - 2));
  const px = wx + (horizontal ? 0 : randOdd(height));
  const py = wy + (horizontal ? randOdd(width) : 0);
  const dx = horizontal ? 0 : 1;
  const dy = horizontal ? 1 : 0;
  do {
    if (wx !== px || wy !== py) {
      grid[wx][wy].isWall = true;
      addedWalls.push(grid[wx][wy]);
    }
    wx += dx;
    wy += dy;
  } while (grid[wx][wy].isWall !== true);
  let nx = x;
  let ny = y;
  let w = horizontal ? width : wy - y;
  let h = horizontal ? wx - x : height;
  divide(grid, nx, ny, w, h, chooseOrientation(w, h));
  ny = horizontal ? y : wy;
  nx = horizontal ? wx : x;
  w = horizontal ? width : y + width - wy - 1;
  h = horizontal ? x + height - wx - 1 : height;
  divide(grid, nx, ny, w, h, chooseOrientation(w, h));
};

const chooseOrientation = (width, height) => {
  if (width < height) return HORIZONTAL;
  else if (width > height) return VERTICAL;
  return Math.random() >= 0.5 ? HORIZONTAL : VERTICAL;
};

const randEven = i => {
  return Math.floor(randomNumber(i, 2) / 2) * 2;
};
const randOdd = i => {
  return Math.floor(Math.random() * (i / 2)) * 2 + 1;
};

const randomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default recursiveDivision;
