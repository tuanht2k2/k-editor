export const selectFileAndFolder = (selected) => {
  return {
    type: "SELECT_FILE_FOLDER",
    payload: selected,
  };
};

export const resetSelectedFileAndFolder = () => {
  return {
    type: "RESET",
    payload: null,
  };
};
