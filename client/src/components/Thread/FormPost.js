import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, refreshPosts } from "../../actions/posts.actions";
import { isEmpty, timestampParser } from "../../Utils";

const FormPost = ({ count }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData]);

  const [file, setFile] = useState(null);
  const [post, setPost] = useState("");
  const [error, setError] = useState("");
  const [previewPicture, setPreviewPicture] = useState("");
  const [preview, setPreview] = useState(false);

  const handlePost = (e) => {
    e.preventDefault();
    if (post || file) {
      const data = new FormData();
      data.append("posterId", userData.userId);
      data.append("content", post);
      if (file) data.append("file", file);
      dispatch(addPost(data));
      setTimeout(() => {
        dispatch(refreshPosts(count + 1));
      }, 400);
      setFile(null);
      setPost("");
      setPreviewPicture("");
    } else setError("Vous ne pouvez pas envoyer un post vide !");
  };
  const handlePicture = (e) => {
    setPreviewPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    setError("");
    if (post.length > 0 || file) {
      setPreview(true);
    } else {
      setPreview(false);
    }
  }, [post, file]);

  return (
    <div className="post-form-container">
      {isLoading ? (
        <img className="loading" src="./img/loading.svg" alt="" />
      ) : (
        <>
          <form className="post-form" onSubmit={handlePost}>
            <textarea
              name="message"
              id="message"
              placeholder="Écrivez un message ..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
            ></textarea>
            <div className="post-form-buttons">
              <label htmlFor="file-upload">
                <img src="./img/image.svg" alt="Ajouter une image" />
              </label>
              <input
                type="file"
                name="file"
                id="file-upload"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  handlePicture(e);
                }}
              />
              <div>
                {preview && (
                  <button
                    type="reset"
                    onClick={() => {
                      setFile(null);
                      setPost("");
                      setPreviewPicture("");
                    }}
                    className="reset"
                  >
                    Annuler
                  </button>
                )}
                <input type="submit" />
              </div>
            </div>
            {error && <p className="error-msg">{error}</p>}
            {preview && (
              <div className="card-container">
                <div className="picture">
                  <img src={userData.pictureUrl} alt=""></img>
                </div>
                <div className="content">
                  <div className="user">
                    <h2>{userData.firstName + " " + userData.lastName}</h2>
                    <p>{timestampParser(Date.now())}</p>
                  </div>
                  <div className="post">
                    <p>{post}</p>
                    {previewPicture && <img src={previewPicture}></img>}
                  </div>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default FormPost;
