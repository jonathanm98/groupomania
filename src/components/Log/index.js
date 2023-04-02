import React, { useState } from "react";
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"

const Log = () => {
  const [loginModal, setLoginModal] = useState(true);
  const [registerModal, setRegisterModal] = useState(false);
  return (
    <>
      {!loginModal && <h2 style={{
        maxWidth: "80vw", maxHeight: "150px", overflow: "auto", margin: "auto", color: "red", fontSize: 'calc(1.2em + 1vw)', textAlign: "center", border: "2px solid red", padding: "5px 1em", borderRadius: "10px"
      }}>Attention ! Ne saisissez pas de mots de passe que vous utilisez réellement, car étant l'un de mes premiers projets, je ne peux pas garantir la sécurité de cette application.</h2>}
      <div className="auth-container">
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
          {registerModal && <RegisterForm />}
          {loginModal && <LoginForm />}
        </div>
      </div>
    </>
  );
};

export default Log;
