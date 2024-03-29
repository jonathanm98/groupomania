import axios from "axios";
import React, {useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import {isEmail} from "validator";

const RegisterForm = () => {
    useEffect(() => {
        document.title = "Groupomania - Inscription";
    }, []);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("")

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [visiblePassword, setVisiblePassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validateInputs = () => {
            let isValid = true;

            if (firstName.length === 0) {
                setFirstNameError("Vous devez saisir un prénom");
                isValid = false;
            } else {
                setFirstNameError("");
            }

            if (lastName.length === 0) {
                setLastNameError("Vous devez saisir un nom");
                isValid = false;
            } else {
                setLastNameError("");
            }

            if (!isEmail(email)) {
                setEmailError("Adresse mail incorrecte");
                isValid = false;
            } else {
                setEmailError("");
            }

            if (password.length < 8) {
                setPasswordError("Votre mot de passe doit faire au moins 8 caractères");
                isValid = false;
            } else {
                setPasswordError("");
            }

            return isValid;
        };

        const formIsValid = validateInputs();

        if (formIsValid) {
            axios({
                method: "POST",
                url: `${import.meta.env.VITE_API_URL}/api/user/register`,
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
            <div className="password-input">
                <input
                    name="password"
                    id="password"
                    type={visiblePassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("")
                    }}
                />
                <label htmlFor="password" onClick={() => {
                    setVisiblePassword(!visiblePassword)
                }}>
                    {
                        visiblePassword ?
                            <ReactSVG src="src/assets/eye-slash.svg"/> :
                            <ReactSVG src="src/assets/eye.svg"/>
                    }

                </label>
            </div>
            <p className="error-msg password-error">{passwordError}</p>

            <input type="submit" value="Inscription" className="btn"/>
            <p className="sucess-msg registration-validate">{successMessage}</p>
        </form>
    );
};

export default RegisterForm;
