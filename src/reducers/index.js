import { combineReducers } from "redux";

const algoReducer = (algo = null, action) => {
  if (action.type === "SELECT_ALGO") return action.payload;
  return algo;
};

export default combineReducers({
  algo: algoReducer
});
