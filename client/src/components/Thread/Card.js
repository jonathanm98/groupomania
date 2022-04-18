import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dateParser, isEmpty } from "../../Utils";
import CommentCard from "./CommentCard";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";

const Card = ({ post, count }) => {
  const [isLoading, setIsLoading] = useState(true);
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const [revealComments, setRevealComments] = useState(false);
  const canUpdate = (user, post) => {
    if (user.userId === post.posterId || user.admin === 1) {
      return true;
    } else return false;
  };

  useEffect(() => {
    !isEmpty(usersData[0]) && setIsLoading(false);
  });

  return (
    <div className="main-container">
      <div className="card-container" key={post.postId}>
        {isLoading ? (
          <img className="loading" src="./img/loading.svg" />
        ) : (
          <>
            <div className="picture">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user.userId === post.posterId) {
                        return user.pictureUrl;
                      }
                    })
                    .join("")
                }
                alt=""
              ></img>
            </div>
            <div className="content">
              <div className="user">
                <h2>
                  {usersData.map((user) => {
                    if (user.userId === post.posterId) {
                      return user.firstName + " " + user.lastName;
                    }
                  })}
                </h2>
                <p>{dateParser(post.createdAt)}</p>
              </div>
              <div className="post">
                <p>{post.content}</p>
                {!isEmpty(post.img) && <img src={post.img}></img>}
              </div>
              <div className="buttons">
                <LikeButton post={post} />
                <button
                  className="post-button"
                  onClick={() => setRevealComments(!revealComments)}
                >
                  <img src="./img/comments.svg" alt="Commenter le post" />
                  {
                    <>
                      <p className="button-text">Commentaire{post.comments.length > 1 ? "s" : ""} </p>
                      <p>{` (${post.comments.length})`}</p>
                    </>
                  }
                </button>
                {canUpdate(userData, post) && (
                  <DeleteButton postId={post.postId} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {revealComments && <CommentCard count={count} post={post} />}
    </div>
  );
};

export default Card;
