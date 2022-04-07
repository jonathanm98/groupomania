const db = require("../config/db");

module.exports.getAllPosts = (req, res) => {
  const posts = [];
  db.query(
    `SELECT 
    id_post AS postId,
    id_user AS posterId,
    post_content AS content,
    post_img AS img,
    post_createdAt AS createdAt
    FROM posts ORDER BY 'post_createdAt' ASC LIMIT 0,${req.params.count}`,
    function (err, data) {
      if (data.length === 0) return res.status(200).send(null);
      if (err) res.status(500).json(err.sqlMessage);
      else {
        data.map((post) => {
          posts.push(post);
        });
        db.query(
          `SELECT 
          id_comment AS commentId,
          id_post AS postId,
          id_user AS userId,
          comment_content AS content,
          comment_createdAt AS createdAt
          FROM comments ORDER BY 'comment_createdAt' ASC`,
          (err, data) => {
            if (err) res.status(500).json(err.sqlMessage);
            else {
              posts.map((post) => {
                const comments = data.filter(
                  (element) => element.postId === post.postId
                );
                post.comments = comments;
              });
              db.query(`SELECT * FROM likes`, (err, data) => {
                if (err) res.status(500).json(err.sqlMessage);
                posts.map((post) => {
                  const likes = data.filter(
                    (element) =>
                      element.id_post === post.postId
                  );

                  const usersLiked = [];

                  likes.map((like) => {
                    usersLiked.push(like.id_user);
                  });
                  post.likes = usersLiked.length;
                  post.usersLiked = usersLiked;
                });
                return res.status(200).json(posts);
              });
            }
          }
        );
      }
    }
  );
};

module.exports.createPost = (req, res) => {
  if (req.file) {
    let img = `http://localhost/images/post/${req.file.filename}`;
    db.query(
      `
  INSERT INTO posts (id_user, post_content, post_img)
  VALUES
  (
    ${db.escape(req.body.posterId)},
    ${db.escape(req.body.content)},
    ${img}
  )
  `,
      (err, data) => {
        if (err) res.status(500).json(err.sqlMessage);
        else res.status(201).send("Post créer");
      }
    );
  } else {
    db.query(
      `
  INSERT INTO posts (id_user, post_content)
  VALUES
  (
    ${db.escape(req.body.posterId)},
    ${db.escape(req.body.content)}
  )
  `,
      (err, data) => {
        if (err) res.status(500).json(err.sqlMessage);
        else res.status(201).send("Post créer");
      }
    );
  }
};

module.exports.deletePost = (req, res) => {
  db.query(
    `DELETE FROM posts WHERE id_post = ${db.escape(req.params.id)}`,
    (err, data) => {
      if (err) res.status(500).json(err.sqlMessage);
      else res.status(200).send("Post supprimé");
    }
  );
};

module.exports.createComment = (req, res) => {
  console.log(req.body);
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    (err, data) => {
      if (data && data.length === 0) res.status(401).send("La cible n'existe pas !");
      else {
        db.query(
          `INSERT INTO comments (id_post, id_user, comment_content)
        VALUES
        (
          ${db.escape(req.body.postId)}, 
          ${db.escape(req.body.commenterId)}, 
          ${db.escape(req.body.content)}
        );`,
          (err, data) => {
            if (err) res.status(500).json(err.sqlMessage);
            else res.status(201).send("Commentaire ajouté !");
          }
        );
      }
    }
  );
};

module.exports.deleteComment = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    (err, data) => {
      if (data.length === 0) res.status(401).send("La cible n'existe pas !");
      else {
        db.query(
          `DELETE FROM comments WHERE id_comment = ${db.escape(req.params.id)}`,
          (err, data) => {
            if (err) res.status(500).json(err.sqlMessage);
            else res.status(200).send("Commentaire supprimé");
          }
        );
      }
    }
  );
};

module.exports.like = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    (err, data) => {
      if (err) res.status(500).json(err.sqlMessage);
      if (data.length === 0) res.status(401).send("La cible n'existe pas !");
      else {
        db.query(
          `SELECT * FROM likes WHERE id_user = ${db.escape(req.body.userId)} AND id_post = ${db.escape(req.params.id)}`,
          async (err, data) => {
            if (data[0]) {
              for (const result of data) {
                if (result.id_user === parseInt(req.body.userId)) {
                  db.query(
                    `DELETE FROM likes WHERE id_post = ${req.params.id} AND id_user = ${req.body.userId}`,
                    (err, data) => {
                      if (err) res.status(500).json(err.sqlMessage);
                      else res.status(201).send("Retrait");
                    }
                  );
                }
              }
            } else {
              db.query(
                `INSERT INTO likes (id_post, id_user, like_value)
              VALUES
              (
                ${db.escape(req.params.id)},
                ${db.escape(req.body.userId)},
                ${db.escape(req.body.likeValue)}
                );`,
                (err, data) => {
                  if (err) res.status(500).json(err.sqlMessage);
                  else res.status(201).send("Ajout");
                }
              );
            }
          }
        );
      }
    }
  );
};
