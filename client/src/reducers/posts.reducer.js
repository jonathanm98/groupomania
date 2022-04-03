import { GET_POSTS } from "../actions/posts.actions";

const initialState = {};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload;
    default:
      return state;
  }
}
