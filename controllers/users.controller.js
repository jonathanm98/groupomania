const db = require("../config/db");
require("dotenv").config({path: "./.env"});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("cookie-parser");
const fs = require("fs");
const UserModel = require("../models/user.model");

// Fonction qui va génèrer un token avec l'id utilisateur pendant la connexion
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN, {
        expiresIn: "24h",
    });
};

// Fonction d'inscription
module.exports.register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body
    try {
        await UserModel.create({firstName, lastName, email, password})
        res.status(201).json({message: "Inscription réussie"});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
};

// Fonction de connexion
module.exports.login = async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const isLogged = await bcrypt.compare(req.body.password, user.password);
        if (!isLogged) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Si le mot de passe est correct, on renvoie un cookie avec le token d'authentification
        const token = createToken(user._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({ message: "Authentification réussie" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


// Fonction de deconnexion qui renvoie un cookie vide
module.exports.logout = async (req, res) => {
    await res.cookie("jwt", "", {
        maxAge: 1,
        sameSite: 'none',  // définir SameSite sur "none" pour autoriser les cookies cross-site
        secure: true,
    });
    res.status(200).send("Vous êtes déconnecté");
};

// Fonction qui récupère les infos de l'utilisateur authentifié
module.exports.getCurrentUser = async (req, res) => {
    const token = req.cookies.jwt;
    const userId = jwt.verify(token, process.env.TOKEN).id;
    const user = await UserModel.findById(userId)
    return res.status(200).json(user);
};

// Fonction qui récupère les infos de tout les utilisateurs
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find()
    return res.status(200).json(users);
};

// Fonction de suppression de comtpe
module.exports.deleteUser = async (req, res) => {
    // on récupère toute les images assiciés à ce compte
    db.query(
        `SELECT post_img AS imgUrl
         FROM posts
         WHERE id_user = ${db.escape(
            req.params.id
        )}
           AND post_img IS NOT NULL
         UNION
         SELECT user_picture AS imgUrl
         FROM users
         WHERE id_user = ${db.escape(
            req.params.id
        )};`,
        async (err, data) => {
            if (err) res.status(500).json(err.sqlMessage);
            // Si on as des images on les map pour supprimer tout les fichiers
            if (data[0]) {
                await data.map((img) => {
                    const file = img.imgUrl.split("/")[5];
                    const folder = img.imgUrl.split("/")[4];
                    if (file !== "default.webp") {
                        fs.unlink(`./images/${folder}/${file}`, (err) => {
                            if (err) console.log(err);
                        });
                    }
                });
                // et on supprime l'utilisateur
                db.query(
                    `DELETE
                     FROM users
                     WHERE id_user = ${db.escape(req.params.id)};`,
                    (err, data) => {
                        if (err) res.status(500).json(err.sqlMessage);
                        else {
                            res.cookie("jwt", "", {maxAge: 1});
                            res.status(200).send("Suppression effectuée !");
                        }
                    }
                );
            }
            // Si on a pas d'images on supprime simplement l'utilisateur
            else {
                db.query(
                    `DELETE
                     FROM users
                     WHERE id_user = ${db.escape(req.params.id)};`,
                    (err, data) => {
                        if (err) res.status(500).json(err.sqlMessage);
                        else {
                            res.cookie("jwt", "", {maxAge: 1});
                            res.status(200).send("Suppression effectuée !");
                        }
                    }
                );
            }
        }
    );
};

// fonction pour editer la photo de l'utilisateur
module.exports.editUserImg = (req, res) => {
    const apiUrl = 'https://' + req.get('host');
    db.query(
        `SELECT user_picture
         FROM users
         WHERE id_user = ${db.escape(
            req.params.id
        )};`,
        (err, data) => {
            if (err) res.status(500).json(err.sqlMessage);
            else if (data[0]) {
                oldImg = data[0].user_picture.split("/")[5];
                let img = `${apiUrl}/images/user/${req.file.filename}`;
                if (oldImg !== "default.webp") {
                    fs.unlink(`./images/user/${oldImg}`, (err) => {
                        if (err) console.log(err);
                    });
                }
                console.log(img)
                db.query(
                    `UPDATE users
                     SET user_picture = ${db.escape(
                        img
                    )}
                     where id_user = ${db.escape(req.params.id)};`,
                    (err, data) => {
                        if (err) console.log(err);
                        else res.status(201).send("Photo de profil mise à jour");
                    }
                );
            }
        }
    );
};

module.exports.editUserBio = (req, res) => {
    db.query(
        `UPDATE users
         SET user_bio = ${db.escape(
            req.body.bio
        )}
         where id_user = ${db.escape(req.params.id)};`,
        (err, data) => {
            if (err) console.log(err);
            else res.status(201).send("Biographie mise à jour");
        }
    );
};
