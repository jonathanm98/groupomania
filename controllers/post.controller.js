const db = require("../config/db");

module.exports.getAllPosts = (req, res) => {
  db.query(
    `SELECT * FROM posts ORDER BY 'post_createdAt' ASC`,
    function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      else res.status(200).send(data);
    }
  );
};

module.exports.getOnePost = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    function (err, data) {
      if (err) res.status(500).json(err.sqlMessage);
      else res.status(200).send(data[0]);
    }
  );
};

module.exports.createPost = (req, res) => {
if (req.file) {
  let img = `http://localhost/images/post/${req.file.filename}`
  db.query(`
  INSERT INTO posts (post_user, post_content, post_img)
  VALUES
  (
    ${db.escape(req.body.posterId)},
    ${db.escape(req.body.message)},
    ${db.escape(img)}
  )
  `, (err,data) => {
    console.log(data);
    if (err) res.status(500).json(err.sqlMessage);
    else res.status(201).send("Post créer")
  })
} else {
  db.query(`
  INSERT INTO posts (post_user, post_content)
  VALUES
  (
    ${db.escape(req.body.posterId)},
    ${db.escape(req.body.message)}
  )
  `, (err,data) => {
    console.log(data);
    if (err) res.status(500).json(err.sqlMessage);
    else res.status(201).send("Post créer")
  })
}
};



module.exports.deletePost = (req, res) => {

};
