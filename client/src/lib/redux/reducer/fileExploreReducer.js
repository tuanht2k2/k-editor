const initialState = { from: "", files: [], folders: [] };

const fileExploreReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_FILE_FOLDER":
      return action.payload;
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default fileExploreReducer;
