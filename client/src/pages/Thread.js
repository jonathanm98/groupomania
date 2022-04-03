import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UidContext } from "../components/AppContext";
import Header from "../components/Header";

const Thread = () => {
  const uid = useContext(UidContext);
  return (
    <div>
      {!uid && <Navigate to="/" />}
      <Header />
      <h1>Thread</h1>
    </div>
  );
};

export default Thread;
