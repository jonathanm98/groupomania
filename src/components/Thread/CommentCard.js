import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  refreshPosts,
} from "../../actions/posts.actions";
import { dateParser, isEmpty } from "../../Utils";
import { UidContext } from "../AppContext";

const CommentCard = ({ post, count }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();
  console.log();

  const handleComment = async (e) => {
    e.preventDefault();
    if (text) {
      dispatch(addComment(post.postId, uid, text));
      setText("");
      setTimeout(() => {
        dispatch(refreshPosts(count));
      }, 200);
    }
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment(post.postId, commentId));
  };

  return (
    <div className="comments-container">
      {post.comments.map((comment) => {
        return (
          <div
            className={
              comment.userId === userData.userId
                ? "comment-card client"
                : "comment-card"
            }
            key={comment.commentId}
          >
            <div className="img-container">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user.userId === comment.userId)
                        return user.pictureUrl;
                      else return null;
                    })
                    .join("")
                }
                alt=""
              />
            </div>
            <div className="content-container">
              <div className="comment-header">
                <h3>
                  {usersData.map((user) => {
                    if (user.userId === comment.userId)
                      return user.firstName + " " + user.lastName;
                  })}
                </h3>
                <p>{dateParser(comment.createdAt)}</p>
              </div>
              <div className="content">
                <p>{comment.content}</p>
                {(userData.admin === 1 ||
                  userData.userId === comment.userId) && (
                  <button
                    className="delete-btn"
                    type="reset"
                    onClick={() => handleDelete(comment.commentId)}
                  >
                    <img src="./img/trash.svg" alt="Supprimer commentaire" />
                    <p>Supprimer</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <form onSubmit={handleComment} className="comment-form">
        <input
          type="text"
          name="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Laisser un commentaire"
        />
        <br />
        <input type="submit" value="Envoyer" />
      </form>
    </div>
  );
};

export default CommentCard;
