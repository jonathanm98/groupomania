const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports.auth = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const token = req.cookies.jwt;
      const userId = await jwt.verify(token, process.env.TOKEN).id;
      db.query(
        `SELECT id_user FROM users WHERE id_user = ${db.escape(userId)}`,
        (err, data) => {
          if (err) console.log(err);
          if (data[0] && data[0].id_user === userId) {
            res.status(200).json({ id: data[0].id_user });
          } else {
            res.status(401).json({
              message:
                "Vous devez être authentifié pour acceder à cette ressource",
            });
          }
        }
      );
    } else {
      res.status(401).json({
        message: "Vous devez être authentifié pour acceder à cette ressource",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Vous devez être authentifié !");
  }
};

module.exports.authView = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const token = req.cookies.jwt;
      const userId = await jwt.verify(token, process.env.TOKEN).id;
      db.query(
        `SELECT id_user FROM users WHERE id_user = ${db.escape(userId)}`,
        (err, data) => {
          if (err) console.log(err);
          if (data[0] && data[0].id_user === userId) next();
          else
            res.status(401).json({
              message:
                "Vous devez être authentifié pour acceder à cette ressource",
            });
        }
      );
    } else {
      res.status(401).json({
        message: "Vous devez être authentifié pour acceder à cette ressource",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Vous devez être authentifié !");
  }
};

module.exports.addContent = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const token = req.cookies.jwt;
      const userId = await jwt.verify(token, process.env.TOKEN).id;
      db.query(
        `SELECT id_user FROM users WHERE id_user = ${db.escape(userId)}`,
        (err, data) => {
          if (err) console.log(err);
          if (data[0] && data[0].id_user === userId) next();
        }
      );
    } else {
      res.status(401).json({
        message: "Vous devez être authentifié pour acceder à cette ressource",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Vous devez être authentifié !");
  }
};

module.exports.authEditUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const userId = await jwt.verify(token, process.env.TOKEN).id;
    if (token) {
      db.query(
        `SELECT * FROM users WHERE id_user = ${db.escape(userId)}`,
        (err, data) => {
          if (
            userId === parseInt(req.params.id) ||
            (data[0] && data[0].user_admin === 1)
          ) {
            next();
          } else
            res.status(401).send("Vous n'êtes pas authorisé à faire ceci !");
        }
      );
    } else {
      res.status(401).send("Vous devez être authentifié !");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Vous devez être authentifié !!");
  }
};

module.exports.authDeleteContent = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const userId = await jwt.verify(token, process.env.TOKEN).id;
    if (token) {
      db.query(
        `SELECT id_user, user_admin FROM users WHERE id_user = ${db.escape(
          userId
        )}`,
        (err, data) => {
          const type = req.url.split("/")[2];
          console.log(
            `SELECT id_user FROM ${type}s WHERE id_${type} = ${db.escape(
              req.params.id
            )}`
          );
          if (data[0] && data[0].user_admin === 1) next();
          else {
            db.query(
              `SELECT id_user FROM ${type}s WHERE id_${type} = ${db.escape(
                req.params.id
              )}`,
              (err, data) => {
                if (data[0] && data[0].id_user === parseInt(userId)) next();
                else res.status(401).send("Vous devez être authentifié !");
              }
            );
          }
        }
      );
    } else {
      res.status(401).send("Vous devez être authentifié !");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Vous devez être authentifié !");
  }
};

module.exports.authLike = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const userId = await jwt.verify(token, process.env.TOKEN).id;
    if (token) {
      db.query(
        `SELECT id_user, user_admin FROM users WHERE id_user = ${db.escape(
          userId
        )}`,
        (err, data) => {
          if (data[0]) next();
          else {
            res.status(401).send("Vous devez être authentifié !");
          }
        }
      );
    } else {
      res.status(401).send("Vous devez être authentifié !");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Vous devez être authentifié !");
  }
};
