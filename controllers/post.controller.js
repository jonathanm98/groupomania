const db = require("../config/db");

module.exports.getAllPosts = (req, res) => {
  const posts = [];
  limitItems = 2
  db.query(
    `SELECT * FROM posts ORDER BY 'id_post' DESC LIMIT ${2},20`,
    function (err, data) {
      if (data.length === 0) return res.status(200).send(null);
      if (err) res.status(500).json(err.sqlMessage);
      else {
        data.map((post) => {
          posts.push(JSON.parse(JSON.stringify(post)));
        });
        db.query(
          `SELECT * FROM comments ORDER BY 'comment_createdAt' ASC`,
          (err, data) => {
            if (err) res.status(500).json(err.sqlMessage);
            else {
              posts.map((post) => {
                const comments = JSON.parse(JSON.stringify(data)).filter(
                  (element) => element.id_post === post.id_post
                );
                post.comments = comments;
              });
              db.query(`SELECT * FROM likes`, (err, data) => {
                if (err) res.status(500).json(err.sqlMessage);
                  posts.map((post) => {
                  const likes = JSON.parse(JSON.stringify(data)).filter(
                    (element) =>
                      element.id_post === post.id_post &&
                      element.like_value === 1
                  );
                  const dislikes = JSON.parse(JSON.stringify(data)).filter(
                    (element) =>
                      element.id_post === post.id_post &&
                      element.like_value === 0
                  );

                  const usersLiked = [];
                  const usersDisliked = [];

                  likes.map((like) => {
                    usersLiked.push(like.id_user);
                  });
                  dislikes.map((dislike) => {
                    usersDisliked.push(dislike.id_user);
                  });
                  post.likes = likes.length;
                  post.dislikes = dislikes.length;
                  post.usersLiked = usersLiked;
                  post.usersDisliked = usersDisliked;
                });
                res.status(200).json(posts);
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
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    (err, data) => {
      if (data.length === 0) res.status(401).send("La cible n'existe pas !");
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
          `SELECT * FROM likes WHERE id_user = ${db.escape(req.body.userId)}`,
          async (err, data) => {
            if (data[0]) {
              for (const result of data) {
                if (result.id_user === parseInt(req.body.userId)) {
                  db.query(`DELETE FROM likes WHERE id_post = ${req.params.id} AND id_user = ${req.body.userId}`, (err, data) => {
                    if (err) res.status(500).json(err.sqlMessage);
                    else res.status(201).send("Retrait");
                  })
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
          });
      }
    }
  );
};
