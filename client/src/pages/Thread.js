import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { incPosts, refreshPosts } from "../actions/posts.actions";
import { UidContext } from "../components/AppContext";
import Header from "../components/Header";
import Card from "../components/Thread/Card";
import FormPost from "../components/Thread/FormPost";
import { isEmpty } from "../Utils";

const Thread = () => {
  const uid = useContext(UidContext);
  const posts = useSelector((state) => state.postsReducer);
  const [initPosts, setInitPosts] = useState(true);
  const [loadPosts, setLoadPosts] = useState(false);
  const [postCount, setPostCount] = useState(5);
  const dispatch = useDispatch();
  document.title = "Groupomania - Fil d'actualité";

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.scrollingElement.scrollHeight
    ) {
      setLoadPosts(true);
    }
  };

  useEffect(() => {
    if (loadPosts) {
      dispatch(incPosts(postCount));
      setLoadPosts(false);
      setPostCount(postCount + 5);
    }
    if (initPosts) {
      dispatch(refreshPosts(postCount));
      setInitPosts(false);
    }
    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadPosts]);

  return (
    <div className="thread-container">
      {!uid && <Navigate to="/" />}
      <Header />
      <h1>Fil d'actualité</h1>
      <FormPost count={postCount} />
      {!isEmpty(posts[0]) ? (
        posts.map((post) => {
          return <Card post={post} count={postCount} key={post.postId} />;
        })
      ) : (
        <h2 className="empty-msg">Aucun post</h2>
      )}
    </div>
  );
};

export default Thread;
