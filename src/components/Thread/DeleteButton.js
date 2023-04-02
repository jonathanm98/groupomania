import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/posts.actions";

const DeleteButton = ({postId}) => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  Modal.setAppElement("#root");

  const handleDelete = () => {
    dispatch(deletePost(postId))
    setDeleteModal(false)
  };

  return (
    <>
      <button
        onClick={() => {
          setDeleteModal(true);
        }}
        className="post-button"
      >
        <img src="./img/trash.svg" alt="Supprimer le post" />
        <p className="button-text">Supprimer</p>
      </button>
      <Modal id="modal-delete" isOpen={deleteModal}>
        <h2>Voulez vous vraiment supprimer le post ?</h2>
        <button className="cancel" onClick={() => setDeleteModal(false)}>
          Annuler
        </button>
        <button className="delete" onClick={() => handleDelete()}>
          Supprimer
        </button>
      </Modal>
    </>
  );
};

export default DeleteButton;
