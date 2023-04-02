const db = require("../config/db");
const fs = require("fs");

// Fonction qui va incrementer les posts 5 par 5 pendant le scrolling de l'utilisateur
module.exports.incPosts = (req, res) => {
  console.log("ffdsfsd");
  const posts = [];
  db.query(
    `SELECT 
    id_post AS postId,
    id_user AS posterId,
    post_content AS content,
    post_img AS img,
    post_createdAt AS createdAt
    FROM posts ORDER BY id_post DESC LIMIT ${req.params.index}, 5`,
    // On utilise juste au dessus l'index des posts contenu
    // dans le front pour récupèrer les 5 suivants
    (err, data) => {
      if (data && data.length === 0) return res.status(200).send(null);
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
          FROM comments`,
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
                    (element) => element.id_post === post.postId
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

// Fonction qui met à jour les posts affichés en front
module.exports.refreshPosts = (req, res) => {
  const posts = [];
  db.query(
    `SELECT 
    id_post AS postId,
    id_user AS posterId,
    post_content AS content,
    post_img AS img,
    post_createdAt AS createdAt
    FROM posts ORDER BY id_post DESC LIMIT 0, ${req.params.count}`,
    (err, data) => {
      if (data && data.length === 0) return res.status(200).send(null);
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
          FROM comments`,
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
                    (element) => element.id_post === post.postId
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

// Fonction de création de post
module.exports.createPost = (req, res) => {
  // Si on envoie une image avec notre post on la renomme et on envoie tout à la DB
  if (req.file) {
    let img = `http://localhost:4242/images/post/${req.file.filename}`;
    db.query(
      `
  INSERT INTO posts (id_user, post_content, post_img)
  VALUES
  (
    ${db.escape(req.body.posterId)},
    ${db.escape(req.body.content)},
    ${db.escape(img)}
  )
  `,
      (err, data) => {
        if (err) console.log(err);
        else res.status(201).send("Post créer");
      }
    );
    // SINON On envoie seulement le post
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

// Fonction de suppression de post
module.exports.deletePost = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE id_post = ${db.escape(req.params.id)}`,
    async (err, data) => {
      // SI on a une image dans notre post on le supprime via le paquet fs
      if (data[0].post_img) {
        postImg = data[0].post_img.split("/")[5];
        fs.unlink(`./images/post/${postImg}`, (err) => {
          if (err) console.log(err);
        });
      }
      db.query(
        `DELETE FROM posts WHERE id_post = ${db.escape(req.params.id)}`,
        (err, data) => {
          if (err) res.status(500).json(err.sqlMessage);
          else res.status(200).send("Post supprimé");
        }
      );
    }
  );
};

// Fonction de creation de commentaire
module.exports.createComment = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    (err, data) => {
      if (data && data.length === 0)
        res.status(401).send("La cible n'existe pas !");
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

// Fonction de creation de commentaire
module.exports.deleteComment = (req, res) => {
  // On vérifie que le post ciblé existe
  db.query(
    `SELECT * FROM comments WHERE id_comment = ${req.params.id}`,
    (err, data) => {
      if (data && data.length === 0)
        res.status(401).send("La cible n'existe pas !");
      else {
        // Et on supprime le commentaire
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

// Fonction d'ajout de like sur un post
module.exports.like = (req, res) => {
  // On vérifie que le post ciblé existe
  db.query(
    `SELECT * FROM posts WHERE id_post = ${req.params.id}`,
    (err, data) => {
      if (err) res.status(500).json(err.sqlMessage);
      if (data.length === 0) res.status(401).send("La cible n'existe pas !");
      else {
        db.query(
          `SELECT * FROM likes WHERE id_user = ${db.escape(
            req.body.userId
          )} AND id_post = ${db.escape(req.params.id)}`,
          async (err, data) => {
            // SI on trouve déjà un like avec cet id_user et ce id_post, l'utilisateur dislike
            // et on supprime donc le like en question
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
            }
            // SINON on sait que l'utilisateur veux ajouter un like et en envoie le like à la DB
            else {
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
