const db = require("../config/db");
require("dotenv").config({ path: "./config/.env" });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("cookie-parser");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: "24h",
  });
};

module.exports.register = async (req, res) => {
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(req.body.password, salt);

  db.query(
    `INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
        VALUES
        (
            "${req.body.firstName}",
            "${req.body.lastName}",
            "${req.body.email}",
            "${password}"
        );
        `,
    function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      else res.status(201).send("Utilisateur créer veuillez vous connecter");
    }
  );
};

module.exports.login = async (req, res) => {
  db.query(
    `SELECT * FROM users WHERE user_email = "${req.body.email}"`,
    async function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      else if (data[0]) {
        const user = data[0];
        const isLogged = await bcrypt.compare(req.body.password, user.user_password);
        if (isLogged) {
          const token = createToken(user.id_user);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
          });
          res.status(200).send("Authentification réussie");
        } else res.status(400).send("Mot de passe ou email incorrect !");
      } else res.status(400).send("Cet utilisateur n'existe pas dans la base de donnée");
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
  if (token) {
    const userId = await jwt.verify(token, process.env.TOKEN).id;
    if (userId === parseInt(req.params.id)) {
      db.query(
        `
        DELETE FROM users WHERE id_user = "${userId}";
        DELETE FROM posts WHERE post_user = "${userId}";
        DELETE FROM comments WHERE comment_user = "${userId}";
        DELETE FROM likes WHERE like_user = "${userId}";
        
        `,
        function (err, data) {
          if (err) res.status(500).json(err.sqlMessage);
          else res.status(200).send("Suppression effectuée");
        }
      );
    } else res.status(401).send("Vous n'êtes pas authorisé à faire ceci !");
  } else {
    res.status(401).send("Vous devez être authentifié !");
  }
};
