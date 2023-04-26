import React, {useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import axios from "axios";
import {isEmail} from "validator";

const LoginForm = () => {
    const [visiblePassword, setVisiblePassword] = useState(false);

    useEffect(() => {
        document.title = "Groupomania - Connexion";
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validateInputs = () => {
            let isValid = true;

            if (!isEmail(email)) {
                setEmailError("Email ou mot de passe incorrect");
                isValid = false;
            } else {
                setEmailError("");
            }

            if (password.length < 8) {
                setPasswordError("Email ou mot de passe incorrect");
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
                url: `${import.meta.env.VITE_API_URL}/api/user/login`,
                withCredentials: true,
                data: {
                    email,
                    password,
                },
            })
                .then(() => {
                    window.location = "/thread";
                })
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
            <div className="password-input">
                <input
                    name="password"
                    id="password"
                    type={visiblePassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                    }}
                />
                <div onClick={() => setVisiblePassword(!visiblePassword)}>
                    {
                        visiblePassword ?
                            <ReactSVG src="src/assets/eye-slash.svg"/> :
                            <ReactSVG src="src/assets/eye.svg"/>}
                </div>
            </div>
            <p className="error-msg password-error">{passwordError}</p>

            <input type="submit" value="Connection" className="btn"/>
        </form>
    );
};

export default LoginForm;
