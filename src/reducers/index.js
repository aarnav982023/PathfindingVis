import { combineReducers } from "redux";

const algoReducer = (algo = 1, action) => {
  if (action.type === "SELECT_ALGO") return action.payload;
  return algo;
};

const diagReducer = (allowDiag = false, action) => {
  if (action.type === "ALLOW_DIAG") return action.payload;
  return allowDiag;
};

const heuristicReducer = (heuristic = { 1: "manhatten" }, action) => {
  if (action.type === "CHANGE_HEURISTIC")
    return { ...heuristic, ...action.payload };
  return heuristic;
};

const mazeReducer = (maze = 0, action) => {
  if (action.type === "SELECT_MAZE") return action.payload;
  return maze;
};

const animMazeReducer = (animMaze = true, action) => {
  if (action.type === "ANIMATE_MAZE") return action.payload;
  return animMaze;
};

const animatingReducer = (anim = false, action) => {
  if (action.type === "SET_ANIMATING") return action.payload;
  return anim;
};

const visitedReducer = (visited = 0, action) => {
  switch (action.type) {
    case "SET_VISITED":
      return action.payload;
    default:
      return visited;
  }
};

const shortestReducer = (shortest = 0, action) => {
  switch (action.type) {
    case "SET_SHORTEST":
      return action.payload;
    default:
      return shortest;
  }
};

export default combineReducers({
  algo: algoReducer,
  diag: diagReducer,
  heuristic: heuristicReducer,
  maze: mazeReducer,
  animMaze: animMazeReducer,
  anim: animatingReducer,
  visited: visitedReducer,
  shortest: shortestReducer
});
