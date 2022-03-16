const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports.noEdit = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {

      db.query(
        `SELECT * FROM users WHERE id_user = ${db.escape(userId)}`,
        (err, data) => {
          if (data[0].id_user === userId) next();
        }
      );
    } else {
      res.status(401).json({
        message: "Vous devez être authentifié pour acceder à cette ressource",
      });
    }
  } catch (err) {
    res.status(401).send("Vous devez être authentifié !");
  }
};

module.exports.authEdit = async (req, res, next) => {
try {
  const token = req.cookies.jwt;
  const userId = await jwt.verify(token, process.env.TOKEN).id;
  db.query(
    `SELECT * FROM users WHERE id_user = ${db.escape(userId)}`,
    (err, data) => {
      if (token) {
        if (userId === parseInt(req.params.id) || data[0].user_admin === 1) {
          next();
        } else res.status(401).send("Vous n'êtes pas authorisé à faire ceci !");
      } else {
        res.status(401).send("Vous devez être authentifié !");
      }
    }
  );
} catch (err) {
  res.status(401).send("Vous devez être authentifié !");
}
};
