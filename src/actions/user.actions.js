import axios from "axios";

export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";

export const getUser = (uid) => {
  return async (dispatch) => {
    return await axios({
      method: "GET",
      url: `${import.meta.env.VITE_API_URL}/api/user/get/`,
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };
};

export const uploadPicture = (data, id) => {
  return async (dispatch) => {
    return await axios({
      method: "PUT",
      url: `${import.meta.env.VITE_API_URL}/api/user/edit/picture/${id}`,
      withCredentials: true,
      data: data,
    })
      .then((res) => {
        return axios({
          method: "GET",
          url: `${import.meta.env.VITE_API_URL}/api/user/get/`,
          withCredentials: true,
        })
          .then((res) =>
            dispatch({ type: UPLOAD_PICTURE, payload: res.data.pictureUrl })
          )
          .catch((err) => {
            console.log(err);
            window.location.reload();
          });
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };
};

export const updateBio = (bio, id) => {
  return async (dispatch) => {
    return await axios({
      method: "PUT",
      url: `${import.meta.env.VITE_API_URL}/api/user/edit/bio/${id}`,
      withCredentials: true,
      data: { bio },
    })
      .then((res) => dispatch({ type: UPDATE_BIO, payload: bio }))
      .catch((err) => console.log(err));
  };
};
