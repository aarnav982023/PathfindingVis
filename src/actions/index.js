export const selectAlgo = algoId => {
  return {
    type: "SELECT_ALGO",
    payload: algoId
  };
};
