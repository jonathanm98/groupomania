import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {dateParser, isEmpty} from "../../Utils";
import CommentCard from "./CommentCard.jsx";
import DeleteButton from "./DeleteButton.jsx";
import LikeButton from "./LikeButton.jsx";

const Card = ({post, count}) => {
    const [isLoading, setIsLoading] = useState(true);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const [revealComments, setRevealComments] = useState(false);
    const [text, setText] = useState(post.content);
    const [video, setVideo] = useState(null);
    const canUpdate = (user, post) => {
        return user._id === post.posterId || user.isAdmin;
    };

    const handleVideo = () => {
        let findLink = post.content?.split(" ");
        for (let i = 0; i < findLink.length; i++) {
            const word = findLink[i];
            if (
                word.includes("https://www.youtube.com") ||
                word.includes("https://youtube.com")
            ) {
                setVideo(word);
                findLink.splice(i, 1);
                setText(findLink.join(" "));
            }
        }
    };

    useEffect(() => {
        !isEmpty(usersData[0]) && setIsLoading(false);
    }, [usersData]);
    useEffect(() => {
        handleVideo();
        //eslint-disable-next-line
    }, [video]);

    return (
        <div className="main-container">
            <div className="card-container" key={post.postId}>
                {isLoading ? (
                    <img className="loading" src="./img/loading.svg" alt="Animation de chargement"/>
                ) : (
                    <>
                        <div className="picture">
                            <img
                                src={
                                    !isEmpty(usersData[0]) &&
                                    usersData
                                        .map((user) => {

                                            if (user._id === post.posterId) {
                                                if (user._id === userData._id) {
                                                    return userData.pictureUrl;
                                                }
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
                                        if (user.userId === post._id) {
                                            return user.firstName + " " + user.lastName;
                                        }
                                    })}
                                </h2>
                                <p>{dateParser(post.createdAt)}</p>
                            </div>
                            <div className="post">
                                <p>{text}</p>
                                {!isEmpty(post.img) && <img src={post.img} alt=""></img>}
                                {video && (
                                    <div className="video-responsive">
                                        <iframe
                                            src={video}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Embedded youtube"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="buttons">
                                <LikeButton post={post}/>
                                <button
                                    className="post-button"
                                    onClick={() => setRevealComments(!revealComments)}
                                >
                                    <img src="./img/comments.svg" alt="Commenter le post"/>
                                    {
                                        <>
                                            <p className="button-text">
                                                Commentaire{post.comments.length > 1 ? "s" : ""}{" "}
                                            </p>
                                            <p>{` (${post.comments.length})`}</p>
                                        </>
                                    }
                                </button>
                                {canUpdate(userData, post) && (
                                    <DeleteButton postId={post._id}/>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {revealComments && <CommentCard count={count} post={post}/>}
        </div>
    );
};

export default Card;
