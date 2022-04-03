import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import postsReducer from "./posts.reducer";

export default combineReducers({ userReducer, postsReducer });
