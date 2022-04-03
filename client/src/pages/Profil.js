import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { UidContext } from "../components/AppContext";
import Header from '../components/Header';

const Profil = () => {
    const uid = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer)
    return (
        <div>
            {!uid && <Navigate to="/" />}
            <Header />
            <h1>Page Profil</h1>
        </div>
    );
};

export default Profil;