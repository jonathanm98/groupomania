import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addPost} from "../../actions/posts.actions";
import {isEmpty, timestampParser, youtubeData} from "../../Utils";

const FormPost = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData]);

  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [post, setPost] = useState("");
  const [error, setError] = useState("");
  const [previewPicture, setPreviewPicture] = useState("");
  const [postError, setPostError] = useState("");
  const [preview, setPreview] = useState(false);
  const [postloading, setPostLoading] = useState(false);

  const handlePost = async (e) => {

    e.preventDefault();
    if (post || file) {
      const data = new FormData();
      data.append("posterId", userData.userId);
      data.append("content", post);
      if (file) data.append("file", file);
      setFile(null);
      setPost("");
      setPreviewPicture("");
      setPostLoading(true);
      await dispatch(addPost(data));
      setPostLoading(false);

    } else setError("Vous ne pouvez pas envoyer un post vide !");
  };

  const handlePicture = (e) => {
    const fileName = e.target.files[0]?.name.split(".");
    const fileNameLength = fileName?.length - 1;

    const removeVideoLink = (text) => {
      let words = text.split(" ");
      words = words.filter((word) => {
        return (
          !word.includes("https://www.youtube.com/watch?v=") &&
          !word.includes("https://youtube.com/watch?v=") &&
          !word.includes("https://www.youtube.com/embed/") &&
          !word.includes("https://youtu.be/_")
        );
      });
      return words.join(" ");
    };

    if (
      e.target.files[0]?.name.split(".")[fileNameLength] === "jpg" ||
      e.target.files[0]?.name.split(".")[fileNameLength] === "jpeg" ||
      e.target.files[0]?.name.split(".")[fileNameLength] === "png" ||
      e.target.files[0]?.name.split(".")[fileNameLength] === "gif" ||
      e.target.files[0]?.name.split(".")[fileNameLength] === "webp"
    ) {
      setPostError("");
      setPreviewPicture(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
      setVideo(null);
      setVideoId(null);
    } else {
      setFile(null);
      setPostError("Vous devez mettre une image valide !");
      setPreviewPicture(removeVideoLink(post));
    }
  };

  const handleVideo = async (videoId) => {
    if (videoId) {
      try {
        return await youtubeData(videoId)
      } catch (error) {
        console.error("Error fetching video data:", error);
        setVideo(null);
        return new Error(error)
      }
    } else {
      setVideo(null);
    }
  };

  useEffect(() => {
    setError("");
    if (post.length > 0 || file || postError) {
      setPreview(true);
    } else {
      setPreview(false);
    }

    // Extract videoId from the post content
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/_?|(?:youtube\.com\/(?:embed\/|watch\?v=)))([\w-]{10,12})(?:\S+)?/;
    const match = post.match(youtubeRegex);
    const videoId = match ? match[1] : null;

    // Call handleVideo with the extracted videoId
    videoId && setVideo(handleVideo(videoId));

    //eslint-disable-next-line
  }, [post, file, video, postError]);


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
              onChange={(e) => {
                setPostError("");
                if (e.target.value.length > 1600) {
                    setPostError("Votre message est trop long (1600 caractères max)");
                    return;
                }
                setPost(e.target.value)
              }}
            ></textarea>
            <div className="post-form-buttons">
              <label htmlFor="file-upload">
                {/* eslint-disable-next-line */}
                <img src="./img/image.svg" alt="Boutton pour ajouter un fichier de type image" />
              </label>
              <input
                type="file"
                name="file"
                id="file-upload"
                accept=".jpg, .jpeg, .png, .gif, .webp"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    if (e.target.files[0].size > 15 * 1024 * 1024) {
                      setFile(e.target.files[0]);
                      setPostError("Le fichier est trop volumineux (15Mo max)");
                      return;
                    }
                    setFile(e.target.files[0]);
                    handlePicture(e);
                  } else {
                    setFile(null);
                    setPreviewPicture("");
                    setPostError("");
                  }
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
                      setVideo(null);
                      setVideoId(null);
                      setPostError("");
                    }}
                    className="reset"
                  >
                    Annuler
                  </button>
                )}
                <input type="submit" value="Publier" />
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
                    <p style={{wordBreak: "break-word"}}>{post}</p>
                    {previewPicture && <img src={previewPicture} alt="Prévisualisation de votre fichier"></img>}
                    {postError && <h2 className="error-msg">{postError}</h2>}
                    {video && (
                      <div className="video-container" >
                        <a href={`https://www.youtube.com/watch?v=${videoId}`}>
                          <img src={video.postError.standard.url} alt={`Liens vers la video : ${video.title}`} />
                          <div className="video-meta">
                            <h3>{video.title}</h3>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {postloading &&
              <img className="loading" src="./img/loading.svg" alt="Animation de chargement" />}
          </form>
        </>
      )}
    </div>
  );
};

export default FormPost;
