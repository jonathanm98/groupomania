const db = require("../config/db");

module.exports.getAllPosts = (req, res) => {
  db.query(
    `SELECT * FROM posts ORDER BY 'post_createdAt' ASC`,
    function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      res.status(200).send(data);
    }
  );
};

module.exports.getOnePost = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      res.status(200).send(data);
    }
  );
};

module.exports.createPost = (req, res) => {};

module.exports.updatePost = (req, res) => {};

module.exports.deletePost = (req, res) => {};
