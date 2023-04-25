import {
  DELETE_COMMENT,
  DELETE_POST,
  INC_POSTS,
  REFRESH_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  GET_LATEST_POST,
} from "../actions/posts.actions";

const initialState = [];

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case REFRESH_POSTS:
      return action.payload;

    case GET_LATEST_POST:
      return [{ ...action.payload }, ...state]

    case INC_POSTS:
      return state.concat(action.payload);

    case LIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          console.log("like" + post)
          return {
            ...post,
            likes: post.likes.concat(action.payload.userId),
          };
        }
        return post;
      });

    case UNLIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          console.log("unlike " + post)
          return {
            ...post,
            likes: post.likes.filter(
              (id) => id !== action.payload.userId
            ),
          };
        }
        return post;
      });

    case DELETE_POST:
      return state.filter((post) => post.postId !== action.payload);

    case DELETE_COMMENT:
      return state.map((post) => {
        if (post.postId === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment.commentId !== action.payload.commentId
            ),
          };
        }
        return post;
      });

    default:
      return state;
  }
}
