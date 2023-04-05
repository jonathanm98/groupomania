import axios from "axios";

export const INC_POSTS = "INC_POSTS";
export const REFRESH_POSTS = "REFRESH_POSTS";
export const CREATE_POSTS = "CREATE_POSTS";
export const GET_LATEST_POST = "GET_LATEST_POST";
export const DELETE_POST = "DELETE_POST";

export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";

export const ADD_COMMENT = "ADD_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

export const incPosts = (index) => {
  return async (dispatch) => {
    return await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/post/${index}`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data[0]) dispatch({ type: INC_POSTS, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };
};

export const refreshPosts = (count) => {
  return async (dispatch) => {
    return await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/post/refresh/${count}`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data[0]) dispatch({ type: REFRESH_POSTS, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };
};

export const addPost = (data) => {
  return async (dispatch) => {

    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/post/create/post`,
      withCredentials: true,
      data,
    }).then((res) => {
      dispatch({ type: GET_LATEST_POST, payload: res.data });
    }).catch((err) => {
      console.log(err);
      window.location.reload();
    });
  };
};


export const likePost = (post, user) => {
  return async (dispatch) => {
    return await axios({
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
        window.location.reload();
        console.log(err);
      });
  };
};

export const unlikePost = (post, user) => {
  return async (dispatch) => {
    return await axios({
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
        window.location.reload();
      });
  };
};

export const deletePost = (postId) => {
  return async (dispatch) => {
    return await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/api/post/delete/post/${postId}`,
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: postId });
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
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
