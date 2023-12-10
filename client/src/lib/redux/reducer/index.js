import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import fileExploreReducer from "./fileExploreReducer";

const rootReducer = combineReducers({
  user: userReducer,
  fileExplore: fileExploreReducer,
});

export default rootReducer;
