import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "../AppContext";
import ProfilCard from "./ProfilCard";

const Header = () => {
  const uid = useContext(UidContext);
  return (
    <div className="header-container">
      <div className="logo-container">
      <NavLink to="/thread">
        <img className="header-logo" src="./img/icon-left-font.png" alt="Aller a l'accueil" />
      </NavLink>
      {uid && <ProfilCard />}
    </div>
    </div>
  );
};

export default Header;
