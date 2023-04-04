import axios from "axios";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import { updateBio, uploadPicture } from "../actions/user.actions";
import { getUsers } from "../actions/users.actions";
import { UidContext } from "../components/AppContext";
import Header from "../components/Header";
import { dateParser } from "../Utils";

const Profil = () => {
  const uid = useContext(UidContext);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);
  document.title = `Groupomania - Profil de ${userData.firstName}`;
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  Modal.setAppElement("#root");

  const [file, setFile] = useState();

  const handlePicture = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    dispatch(uploadPicture(data, userData.userId)).then((e) => console.log(e));
    // window.location.reload();
  };
  const handleBio = () => {
    dispatch(updateBio(bio, userData.userId));
    setUpdateForm(false);
  };
  const previewPicture = function (e) {
    const image = document.getElementById("profil-preview");
    const picture = e.files[0];

    if (picture) {
      image.src = URL.createObjectURL(picture);
      dispatch(getUsers(0));
    }
  };
  const disconnect = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/user/logout`,
      withCredentials: true,
    })
      .then((res) => (window.location.reload()))
      .catch((err) => console.log(err));
  };
  const handleDelete = () => {
    setDeleteModal(false);
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/api/user/delete/${userData.userId}`,
      withCredentials: true,
    })
      .then((res) => (window.location.reload()))
      .catch((err) => console.log(err));
  };
  return (
    <div className="profil-container">
      {!uid || (!userData && <Navigate to="/" />)}
      <Header />
      <h1>Profil de {`${userData.firstName} ${userData.lastName}`}</h1>
      <div className="bloc-profil">
        <div className="img-bloc">
          <h2>Photo de profil</h2>
          <img id="profil-preview" src={userData.pictureUrl} alt="" />
          <form onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file" className="label-btn">
              Changer de photo
            </label>
            <br />
            <input
              type="file"
              id="file"
              className="input-file"
              name="file"
              accept=".jpg, .jpg, .png"
              required
              onChange={(e) => {
                setFile(e.target.files[0]);
                previewPicture(e.target);
              }}
            />
            <br />
            <input type="submit" value="Envoyer" />
          </form>
        </div>

        <div className="info-bloc">
          <h2>Infos</h2>
          <div className="bio-container">
            <h3>Bio</h3>
            <div className="bio-update">
              {updateForm === false && (
                <>
                  <p onClick={() => setUpdateForm(!updateForm)}>
                    {userData.bio}
                  </p>
                  <br />
                  <button onClick={() => setUpdateForm(!updateForm)}>
                    Modifier bio
                  </button>
                </>
              )}
              {updateForm && (
                <>
                  <textarea
                    type="text"
                    defaultValue={userData.bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  <br />
                  <button onClick={handleBio}>Valider modifications</button>
                </>
              )}
            </div>
          </div>

          <p>Utilisateur créer le : {dateParser(userData.createdAt)}</p>

          <div className="button-container">
            <button onClick={disconnect}>Se déconnecter</button>
            <button onClick={() => setDeleteModal(true)} className="delete">
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
      <Modal id="modal-delete" isOpen={deleteModal}>
        <h2>Voulez vous vraiment supprimer votre compte ?</h2>
        <p>Attention ! Cette action est irréversible.</p>
        <button className="cancel" onClick={() => setDeleteModal(false)}>
          Annuler
        </button>
        <button className="delete" onClick={() => handleDelete()}>
          Supprimer le compte
        </button>
      </Modal>
    </div>
  );
};

export default Profil;
