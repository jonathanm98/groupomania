import axios from "axios";

export const INC_POSTS = "INC_POSTS";
export const REFRESH_POSTS = "REFRESH_POSTS";
export const CREATE_POSTS = "CREATE_POSTS";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const DELETE_POST = "DELETE_POST";

export const ADD_COMMENT = "ADD_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

export const incPosts = (index) => {
  return (dispatch) => {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/post/${index}`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data[0]) dispatch({ type: INC_POSTS, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        window.location = "/";
      });
  };
};

export const refreshPosts = (count) => {
  return (dispatch) => {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/post/refresh/${count}`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data[0]) dispatch({ type: REFRESH_POSTS, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        window.location = "/";
      });
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    return axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/post/create/post`,
      withCredentials: true,
      data,
    })
      .catch((err) => {
        window.location = "/";
        console.log(err);
      });
  };
};

export const likePost = (post, user) => {
  return (dispatch) => {
    return axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/post/like/${post}`,
      withCredentials: true,
      data: {
        userId: user,
        likeValue: 1,
      },
    })
      .then((res) => {
        dispatch({
          type: LIKE_POST,
          payload: {
            postId: post,
            userId: user,
          },
        });
      })
      .catch((err) => {
        window.location = "/";
        console.log(err);
      });
  };
};

export const unlikePost = (post, user) => {
  return (dispatch) => {
    return axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/post/dislike/${post}`,
      withCredentials: true,
      data: {
        userId: user,
        likeValue: 1,
      },
    })
      .then((res) => {
        dispatch({
          type: UNLIKE_POST,
          payload: {
            postId: post,
            userId: user,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        window.location = "/";
      });
  };
};

export const deletePost = (postId) => {
  return (dispatch) => {
    return axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/api/post/delete/post/${postId}`,
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: postId });
      })
      .catch((err) => {
        console.log(err);
        window.location = "/";
      });
  };
};

export const addComment = (postId, commenterId, content) => {
  return (dispatch) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/post/create/comment`,
      withCredentials: true,
      data: { postId, commenterId, content },
    })
      .then((res) =>
        dispatch({
          type: ADD_COMMENT,
          payload: { postId, commenterId, content },
        })
      )
      .catch((err) => console.log(err));
  };
};

export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/api/post/delete/comment/${commentId}`,
      withCredentials: true,
    }).then((res) =>
      dispatch({ type: DELETE_COMMENT, payload: { postId, commentId } })
    );
  };
};
