import React, { useState } from "react";
import axios from "axios";
import { isEmail } from "validator";

const LoginForm = () => {
  document.title = "Groupomania - Connexion"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validForm, setValidForm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateInputs = () => {
      if (!isEmail(email)) {
        setEmailError("Email ou mot de passe incorrect");
        setValidForm(false);
      } else setValidForm(true);
      if (password.length < 8) {
        setPasswordError("Email ou mot de passe incorrect");
        setValidForm(false);
      } else setValidForm(true);
    };
    validateInputs();
    if (validForm) {
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/api/user/login`,
        withCredentials: true,
        data: {
          email,
          password,
        },
      })
        .then((res) => window.location = "/")
        .catch((err) => {
          if (err.response.data.credentials) {
            setPasswordError(err.response.data.credentials);
          }
        });
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="email">Email</label>
      <input
        name="email"
        id="email"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
      />
      <p className="error-msg email-error">{emailError}</p>

      <label htmlFor="password">Mot de passe</label>
      <input
        name="password"
        id="password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
      />
      <p className="error-msg password-error">{passwordError}</p>

      <input type="submit" value="Connection" className="btn" />
    </form>
  );
};

export default LoginForm;
