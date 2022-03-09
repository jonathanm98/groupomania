CREATE DATABASE IF NOT EXISTS `groupomania`;

USE `groupomania`;

DROP TABLE IF EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users` 
(
    `id_user` INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `user_firstName` VARCHAR(30) NOT NULL,
    `user_lastName` VARCHAR(30) NOT NULL,
    `user_email` VARCHAR(100) NOT NULL UNIQUE,
    `user_picture` VARCHAR(500) DEFAULT 'https://localhost/images/default.jpg',
    `user_password` VARCHAR(500) NOT NULL,
    `user_registration` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_admin` BOOLEAN DEFAULT false,
    CONSTRAINT CHK_email check (user_email LIKE "%@%")
);

DROP TABLE IF EXISTS `posts`;

CREATE TABLE IF NOT EXISTS `posts`
(
    `id_post` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `post_user` INT NOT NULL,
    `post_content` VARCHAR(500),
    `post_img` VARCHAR(100),
    `post_createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `comments`;

CREATE TABLE IF NOT EXISTS `comments`
(
    `id_comment` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `comment_user` INT NOT NULL,
    `comment_post` INT NOT NULL,
    `comment_content` VARCHAR(280) NOT NULL,
    `comment_createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `likes`;

CREATE TABLE IF NOT EXISTS `likes`
(
    `id_like` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `like_user` INT NOT NULL,
    `like_post` INT NOT NULL,
    `like_value` BOOLEAN NOT NULL
);