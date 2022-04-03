import React, { useContext } from "react";
import Header from "../components/Header";
import Log from "../components/Log";
import { UidContext } from "../components/AppContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const uid = useContext(UidContext);

  return (
    <div className="home-container">
      <Header />
      {uid ? <Navigate to="/thread" /> : <Log />}
    </div>
  );
};

export default Home;
