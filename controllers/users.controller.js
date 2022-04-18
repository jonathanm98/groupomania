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
      res.status(400).json({ email: "Email incorrect" });
      break;
    case req.body.password.length >= 8:
      res.status(400).json({
        password: "Votre mot de passe doit contenir au moins 8 caractères",
      });
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
            res
              .status(400)
              .json({ email: "Un utilisateur existe déjà avec cet email !" });
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
          await res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
          });
          res.status(200).json({ message: "Authentification réussie" });
        } else
          res
            .status(400)
            .json({ credentials: "Email ou mot de passe incorrect !" });
      } else
        res
          .status(400)
          .json({ credentials: "Email ou mot de passe incorrect !" });
    }
  );
};

module.exports.logout = async (req, res) => {
  console.log("ok");
  await res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.status(200).send("Vous êtes déconnecté");
};

module.exports.getCurrentUser = (req, res) => {
  const token = req.cookies.jwt;
  const userId = jwt.verify(token, process.env.TOKEN).id;
  db.query(
    `SELECT 
    id_user AS userId, 
    user_firstName AS firstName,
    user_lastName AS lastName,
    user_picture AS pictureUrl,
    user_bio AS bio,
    user_registration AS createdAt,
    user_admin AS admin
    FROM users WHERE id_user = ${db.escape(userId)}`,
    (err, data) => {
      res.status(200).json(data[0]);
    }
  );
};

module.exports.getAllUsers = (req, res) => {
  db.query(
    `SELECT 
  id_user AS userId, 
  user_firstName AS firstName,
  user_lastName AS lastName,
  user_picture AS pictureUrl
  FROM users`,
    (err, data) => {
      res.status(200).json(data);
    }
  );
};

module.exports.getOneUser = (req, res) => {
  db.query(
    `SELECT 
    id_user AS userId, 
    user_firstName AS firstName,
    user_lastName AS lastName,
    user_picture AS pictureUrl,
    user_bio AS bio,
    user_registration AS createdAt,
    user_admin AS admin
    FROM users WHERE id_user = ${db.escape(req.params.id)}`,
    (err, data) => {
      res.status(200).json(data[0]);
    }
  );
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
        `SELECT post_img AS imgUrl FROM posts WHERE id_user = ${db.escape(
          req.params.id
        )} AND post_img IS NOT NULL
      UNION
      SELECT user_picture AS imgUrl FROM users WHERE id_user = ${db.escape(
        req.params.id
      )};`,
        async (err, data) => {
          if (err) res.status(500).json(err.sqlMessage);
          await data.map((img) => {
            const file = img.imgUrl.split("/")[5];
            const folder = img.imgUrl.split("/")[4];
            console.log(folder, file);
            if (file !== "default.jpg") {
              fs.unlink(`./images/${folder}/${file}`, (err) => {
                if (err) console.log(err);
                db.query(
                  `DELETE FROM users WHERE id_user = ${db.escape(
                    req.params.id
                  )};`,
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
            } else {
              db.query(
                `DELETE FROM users WHERE id_user = ${db.escape(
                  req.params.id
                )};`,
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
            }
          });
        }
      );
    }
  );
};
module.exports.editUserImg = (req, res) => {
  db.query(
    `SELECT user_picture FROM users WHERE id_user = ${db.escape(
      req.params.id
    )};`,
    (err, data) => {
      if (err) res.status(500).json(err.sqlMessage);
      else if (data[0]) {
        oldImg = data[0].user_picture.split("/")[5];
        let img = `http://localhost:4242/images/user/${req.file.filename}`;
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

module.exports.editUserBio = (req, res) => {
  db.query(
    `UPDATE users SET user_bio = ${db.escape(
      req.body.bio
    )} where id_user = ${db.escape(req.params.id)};`,
    (err, data) => {
      if (err) console.log(err);
      else res.status(201).send("Biographie mise à jour");
    }
  );
};
