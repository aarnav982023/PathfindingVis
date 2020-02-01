export const selectAlgo = algoId => {
  return {
    type: "SELECT_ALGO",
    payload: algoId
  };
};

export const allowDiag = allowDiag => {
  return {
    type: "ALLOW_DIAG",
    payload: allowDiag
  };
};

export const changeHeuristic = heuristic => {
  return {
    type: "CHANGE_HEURISTIC",
    payload: heuristic
  };
};

export const selectMaze = maze => {
  return {
    type: "SELECT_MAZE",
    payload: maze
  };
};

export const animateMaze = animMaze => {
  return {
    type: "ANIMATE_MAZE",
    payload: animMaze
  };
};

export const setAnimating = isAnim => {
  return {
    type: "SET_ANIMATING",
    payload: isAnim
  };
};

export const setVisited = visited => {
  return {
    type: "SET_VISITED",
    payload: visited
  };
};

export const setShortest = shortest => {
  return {
    type: "SET_SHORTEST",
    payload: shortest
  };
};
