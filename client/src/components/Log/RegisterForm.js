import axios from "axios";
import React, { useState } from "react";
import { isEmail } from "validator";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validForm, setValidForm] = useState(false);

  const [successMessage, setSuccessMessage] = useState("")

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateInputs = () => {
      if (firstName.length === 0) {
        setFirstNameError("Vous devez saisir un prénom");
        setValidForm(false)
      } else setValidForm(true);
      if (lastName.length === 0) {
        setLastNameError("Vous devez saisir un nom");
        setValidForm(false)
      } else setValidForm(true);
      if (!isEmail(email)) {
        setEmailError("Adresse mail incorrecte");
        setValidForm(false)
      } else setValidForm(true);
      if (password.length < 8) {
        setPasswordError("Votre mot de passe doir faire au moins 8 caractères ");
        setValidForm(false)
      } else setValidForm(true);
    };
    validateInputs()
    if (validForm) {
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/api/user/register`,
        withCredentials: true,
        data: {
          firstName,
          lastName,
          email,
          password
        }
      })
      .then((res) => setSuccessMessage(res.data))
      .catch((err) => {
        if (err.response.data.email) {
          setEmailError(err.response.data.email);
        }
        if (err.response.data.password) {
          setPasswordError(err.response.data.password);
        }
      })
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="firstname">Prénom</label>
      <input
        name="firstname"
        id="firstname"
        type="text"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          setFirstNameError("")
        }}
      />
      <p className="error-msg firstname-error">{firstNameError}</p>

      <label htmlFor="lastname">Nom</label>
      <input
        name="lastname"
        id="lastname"
        type="text"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          setLastNameError("")
        }}
      />
      <p className="error-msg lastname-error">{lastNameError}</p>

      <label htmlFor="email">Email</label>
      <input
        name="email"
        id="email"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("")
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
          setPasswordError("")
        }}
      />
      <p className="error-msg password-error">{passwordError}</p>

      <input type="submit" value="Inscription" className="btn" />
      <p className="sucess-msg registration-validate">{successMessage}</p>
    </form>
  );
};

export default RegisterForm;
