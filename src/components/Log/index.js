import React, { useState } from "react";
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"

const Log = () => {
    const [loginModal, setLoginModal] = useState(true);
    const [registerModal, setRegisterModal] = useState(false);
  return (
    <div className="auth-container">
      {/* <h1>{loginModal ? "Connexion" : "Inscription"}</h1> */}
      <div className="auth-nav">
        <ul>
          <li onClick={(e) => {
              setLoginModal(false);
              setRegisterModal(true);
          }} className={registerModal ? "active-btn" : ""}>S'inscrire</li>
          <li onClick={(e) => {
              setLoginModal(true);
              setRegisterModal(false);
          }} className={loginModal ? "active-btn" : ""}>Se connecter</li>
        </ul>
      </div>
      <div className="auth-form">
        {registerModal && <RegisterForm/>}
        {loginModal && <LoginForm/>}
      </div>
    </div>
  );
};

export default Log;
