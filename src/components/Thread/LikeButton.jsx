import React, {useContext, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {likePost, unlikePost} from "../../actions/posts.actions";
import {UidContext} from "../AppContext.jsx";

const LikeButton = ({post}) => {
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext);
    const dispatch = useDispatch();

    useEffect(() => {
        if (post.likes.includes(uid)) setLiked(true);
        else setLiked(false);
    }, [uid, post.usersLiked]);

    const like = () => {
        dispatch(likePost(post._id, uid));
        setLiked(true);
    };
    const unlike = () => {
        dispatch(unlikePost(post._id, uid));
        setLiked(false);
    };

    return (
        <>
            <button className="post-button" onClick={liked ? unlike : like}>
                <img src={liked ? "./img/heart-filled.svg" : "./img/heart.svg"} alt="Aimer le post"/>
                <p className="button-text">Aimer</p>
                <p>({post.likes.length})</p>
            </button>
        </>
    );
};

export default LikeButton;
