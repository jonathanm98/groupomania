import axios from "axios";

export const GET_USER = "GET_USER";

export const getUser = (uid) => {
  return (dispatch) => {
    return axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/api/user/get/${uid}`,
        withCredentials: true
    })
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
