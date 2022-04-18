import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/posts.actions";
import { UidContext } from "../AppContext";

const LikeButton = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post.usersLiked.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, post.usersLiked]);

  const like = () => {
    dispatch(likePost(post.postId, uid));
    setLiked(true);
  };
  const unlike = () => {
    dispatch(unlikePost(post.postId, uid));
    setLiked(false);
  };

  return (
    <>
      {liked && (
        <button className="post-button" onClick={unlike}>
          <img src="./img/heart-filled.svg" alt="Ne plus aimer le post" />
          <p className="button-text">Ne plus aimer</p>
          <p>({post.likes})</p>
        </button>
      )}
      {liked === false && (
        <button className="post-button" onClick={like}>
          <img src="./img/heart.svg" alt="Aimer le post" />
          <p className="button-text">Aimer</p>
          <p>({post.likes})</p>
        </button>
      )}
    </>
  );
};

export default LikeButton;
