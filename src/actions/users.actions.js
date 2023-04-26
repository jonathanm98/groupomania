import axios from "axios";

export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return async (dispatch) => {
    return await axios({
      method: "GET",
      url: `${import.meta.env.VITE_API_URL}/api/user/get/all`,
      withCredentials: true,
    })
      .then((res) => dispatch({ type: GET_USERS, payload: res.data }))
      .catch((err) => console.log(err));
  };
};
