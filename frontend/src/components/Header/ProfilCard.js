import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const ProfilCard = () => {
  const userData = useSelector((state) => state.userReducer);

  return (
    <NavLink className="profil-card" to="/profil">
      <img src={userData.pictureUrl} alt="" />
      <p>{userData.firstName}</p>
    </NavLink>
  );
};

export default ProfilCard;
