DROP DATABASE IF EXISTS `groupomania`;

CREATE DATABASE `groupomania`;

USE `groupomania`;

CREATE USER IF NOT EXISTS 'client'@'192.168.1.3' IDENTIFIED BY 'ft8_gfdqzr46-fghjklm';

GRANT CREATE, DELETE, INSERT, SELECT ON groupomania.* TO 'client'@'192.168.1.3';

CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `user_firstName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_lastName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_picture` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT 'http://localhost:4242/images/user/default.jpg',
  `user_password` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_registration` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_admin` tinyint(1) DEFAULT '0',
  `user_bio` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `id_user` (`id_user`),
  UNIQUE KEY `user_email` (`user_email`),
  CONSTRAINT `CHK_email` CHECK ((`user_email` like _utf8mb4'%@%'))
);

CREATE TABLE `posts` (
  `id_post` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `post_content` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `post_img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `post_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_post`),
  KEY `posts_fk_iduser` (`id_user`),
  CONSTRAINT `posts_fk_iduser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
);

CREATE TABLE `comments` (
  `id_comment` int NOT NULL AUTO_INCREMENT,
  `id_post` int NOT NULL,
  `id_user` int NOT NULL,
  `comment_content` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_comment`),
  KEY `comments_fk_idpost` (`id_post`),
  KEY `comments_fk_iduser` (`id_user`),
  CONSTRAINT `comments_fk_idpost` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id_post`) ON DELETE CASCADE,
  CONSTRAINT `comments_fk_iduser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
);

CREATE TABLE `likes` (
  `id_like` int NOT NULL AUTO_INCREMENT,
  `id_post` int NOT NULL,
  `id_user` int NOT NULL,
  `like_value` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_like`),
  KEY `likes_fk_idpost` (`id_post`),
  KEY `likes_fk_iduser` (`id_user`),
  CONSTRAINT `likes_fk_idpost` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id_post`) ON DELETE CASCADE,
  CONSTRAINT `likes_fk_iduser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
);


INSERT INTO users (user_firstName, user_lastName, user_email, user_password, user_admin)
VALUES
(
  "Jonathan",
  "Menelet",
  "jonathanmenelet@hotmail.fr",
  "$2b$10$2zRL0siCVbnfzXqXQn4MUuAm8beq0Zf73ASDrD.r1NoNR15h.Ghxy",
  1
);
INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
VALUES
(
  "Alain",
  "Melon",
  "alain@hotmail.fr",
  "alain000"
),
(
  "Jean-Paul",
  "Pelle Mondos",
  "jeanpaul@hotmail.fr",
  "jeanpaul000"
),
(
  "Catherine",
  "Doccasion",
  "catherine@hotmail.fr",
  "catherine000"
),
(
  "Vincent ",
  "La Caf",
  "vincent@hotmail.fr",
  "vincent000"
),
(
  "Gérard",
  "Deux par deux",
  "gerard@hotmail.fr",
  "gerard000"
);

INSERT INTO posts (id_user, post_content, post_img)
VALUES
(1, "Bienvenue à tous sur mon réseau social", "http://localhost:4242/images/post/welcome.png");

INSERT INTO posts (id_user, post_content)
VALUES
(6, "Fumee glace ici dur vin halte avait abord. Tenacite drapeaux posseder le jeunesse vaudrait on et doctrine il."),
(4, "Oui eclat que talus ici parmi mal canon. Du je fievre genoux verdit grille claire va."),
(5, "Gardent ils dociles minutes conflit fer. Aimons de soldat masses ce ca boules contes poteau eu."),
(2, "Indulgence fraternite imprudente frequentes toi commandant subitement mur moi."),
(1, "Est ere nid passent doubles beffroi minutes extreme. Reprises remettre caissons passions xv tu te."),
(3, "Repartit peu fer mes ennemies viennent par. Boules ils livree mirent toi non routes mal."),
(6, "Executeurs au defilaient le un subitement lumineuses. Progres art qui douleur dansent courtes ton."),
(2, "Va militaire consumait alternent souvenirs oh arrachait. Jet douze peu foret verte halte savez dut. Ici infanterie nationales tricolores ils bouquetins permission."),
(4, "Eut ici flaques nations fleurir empeche les malheur. "),
(2, "Cent peu pres sons moi cree. Feeriques polygones ah suspendue enfantent il qu prenaient."),
(3, "Fit gloire jurons que petite ces ici arbres mirent. Heure en la neige actes he quand faite puits. Je veilla allons la he ma lieues. Nul adjudants ici dit suspendue tiendrons ici. "),
(5, "Dures files peu eut alors ses voila une rangs plein. Fanfares derriere ouvertes flottent regardez eue les prudence des."),
(4, "e il elle dans oh etat joie venu sons. Trimons on nations il quitter. La accourt conduit maladie tu."),
(1, "Encontre victoire detourne ifs philippe eau nul. Seulement petillent cet cependant affection fin. Hate cher joue pic faut chez est mais dur."),
(5, "Descendons jet commandant non caracolent infanterie ras. Appris aux croyez vit dessus."),
(3, "Et le touffes tapisse fleurir. Donc sans tete avez bien nid son. Du la puissions signalant sanglante le uniformes reprendre. Ca flaques or ah chatoie conquis qu. "),
(1, "Gloire arbres avance bonnes la depart en oh pendus. Trahison regiment ce he musiques derriere ethiopie quarante."),
(2, "Peu ifs ordonnance ame les pressaient manoeuvres. Touchee chasses comprit reflete il couvert briques oh."),
(5, "Asiatiques ici paraissent moustachus grouillent evidemment vin pas avancaient une."),
(4, "Menent au rumeur sortes fievre parler on cercle. Ils poussait trahison illumine ils pressait joyeuses peu oui.");