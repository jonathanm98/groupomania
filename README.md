# Projet Groupomania - Jonathan Menelet

## Tâches réalisées

##### Création d'une API sécusisée :
* Utilise un système de base de donnée SQL
* Permet de créer un compte et de se connecter de manière sécurisée.
* Permet de créer ou éditer des posts/commentaires en utilisant des middleware d'authentifications
* Permet à un utilisateur avec des droits administrateur de modérer le contenu du site

##### Création d'une application front REACT :
* Ne permet pas à un utilisateur authentifié d'acceder au site
* Utilise les cookies pour rentre persistante l'authentification de l'utilisateur
* Utilise un 'Lazy Loading' pour charger progressivement les posts de l'utilisateur de manière à optimiser les requètes à l'API

## Installation

##### Base de données mysql

Créer une base de données en utilisant le fichier `db.sql` founi qui contiens l'utilisateur et quelques données

##### Installation et lancement du backend

```sh
cd jonathanmenelet_7_09032022-master
npm i
npm start
```
##### Installation et lancement du front REACT

```sh
cd jonathanmenelet_7_09032022-master/client
npm i
npm start
```
