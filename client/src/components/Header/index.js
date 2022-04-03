import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "../AppContext";
import ProfilCard from "./ProfilCard";

const Header = () => {
  const uid = useContext(UidContext);
  return (
    <div className="logo-container">
      <NavLink to="/thread">
        <img src="./img/icon-left-font.png" alt="" />
      </NavLink>
      {uid && <ProfilCard />}
    </div>
  );
};

export default Header;
