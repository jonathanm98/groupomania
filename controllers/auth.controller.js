const db = require("../config/db");
require("dotenv").config({ path: "./config/.env" });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("cookie-parser");
const fs = require("fs");
const { isEmail } = require("validator");
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: "24h",
  });
};

module.exports.register = async (req, res) => {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(req.body.password, salt);

  const email = req.body.email.toLowerCase().trim();
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  switch (false) {
    case isEmail(email):
      res.status(400).send("Email incorrect");
      break;
    case req.body.password.length >= 8:
      res
        .status(400)
        .send("Votre mot de passe doit contenir au moins 8 caractères");
      break;
    default:
      db.query(
        `INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
        VALUES
        (
            ${db.escape(firstName)},
            ${db.escape(lastName)},
            ${db.escape(email)},
            ${db.escape(password)}
        );
        `,
        function (err, data) {
          if (err)
            res.status(400).send("Un utilisateur existe déjà avec cet email !");
          else
            res.status(201).send("Utilisateur créer veuillez vous connecter");
        }
      );
  }
};

module.exports.login = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  db.query(
    `SELECT * FROM users WHERE user_email = ${db.escape(email)}`,
    async function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      else if (data[0]) {
        const user = data[0];
        const isLogged = await bcrypt.compare(
          req.body.password,
          user.user_password
        );
        if (isLogged) {
          const token = createToken(user.id_user);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
          });
          res.status(200).send("Authentification réussie");
        } else res.status(400).send("Mot de passe incorrect !");
      } else
        res
          .status(400)
          .send("Cet utilisateur n'existe pas dans la base de donnée");
    }
  );
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.status(200).send("Vous êtes déconnecté");
};

module.exports.deleteUser = async (req, res) => {
  const token = req.cookies.jwt;
  const userId = jwt.verify(token, process.env.TOKEN).id;
  let isAdmin = false;

  db.query(
    `SELECT user_admin FROM users WHERE id_user = ${db.escape(userId)}`,
    (err, data) => {
      if (data[0].user_admin == 1) isAdmin = true;

      db.query(
      `SELECT post_img AS imgUrl FROM posts WHERE id_user = ${db.escape(req.params.id)} 
      UNION
      SELECT user_picture AS imgUrl FROM users WHERE id_user = ${db.escape(req.params.id)} AND user_picture NOT LIKE '%/default.jpg';`,
        async (err, data) => {
          if (err) res.status(500).json(err.sqlMessage);
          await data.map((img) => {
            const file = img.imgUrl.split("/")[5];
            const folder = img.imgUrl.split("/")[4];
            console.log(folder, file);
            if (img !== "default.jpg") {
              fs.unlink(`./images/${folder}/${file}`, (err) => {
                if (err) console.log(err);
                db.query(
                  `DELETE FROM users WHERE id_user = ${db.escape(req.params.id)};`,
                  (err, data) => {
                    if (err) res.status(500).json(err.sqlMessage);
                    else {
                      if (!isAdmin) {
                        res.cookie("jwt", "", { maxAge: 1 });
                      }
                      res.status(200).send("Suppression effectuée !");
                    }
                  }
                );
              });
            }
          });
        }
      );
    }
  );
};

module.exports.editUser = (req, res) => {
  db.query(
    `SELECT user_picture FROM users WHERE id_user = ${db.escape(
      req.params.id
    )};`,
    (err, data) => {
      if (err) res.status(500).json(err.sqlMessage);
      else if (data[0]) {
        oldImg = data[0].user_picture.split("/")[5];
        let img = `http://localhost/images/user/${req.file.filename}`;
        if (oldImg !== "default.jpg") {
          fs.unlink(`./images/user/${oldImg}`, (err) => {
            if (err) console.log(err);
          });
        }
        db.query(
          `UPDATE users SET user_picture = ${db.escape(
            img
          )} where id_user = ${db.escape(req.params.id)};`,
          (err, data) => {
            if (err) console.log(err);
            else res.status(201).send("Photo de profil mise à jour");
          }
        );
      }
    }
  );
};
