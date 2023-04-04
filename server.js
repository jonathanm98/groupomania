const express = require("express");
const cookieParser = require("cookie-parser");
const usersRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/post.routes");
require("dotenv").config({ path: "./.env" });
const db = require("./config/db");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");


const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin} - Size: ${req.socket.bytesRead} bytes`);
  next();
};

const app = express();

app.use(requestLogger);

const corsOptions = {
  //origin: "http://localhost:3000",
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const addCorsHeaders = (req, res, next) => {
  // Autoriser l'accès depuis l'application front
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);

  // Autoriser l'utilisation des cookies avec les requêtes
  res.header("Access-Control-Allow-Credentials", true);

  // Autoriser les méthodes HTTP suivantes
  res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, PATCH");

  // Autoriser les headers suivants avec les requêtes
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Continuer avec la requête suivante
  next();
};

app.use(cors(corsOptions));
app.use(addCorsHeaders);

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());

app.use(xss());

db.connect(function (err) {
  if (err) throw err;
  console.log("Base de données initialisée");
});

app.use("/api/user", usersRoutes);
app.use("/api/post", postRoutes);
app.use("/images/user", express.static("images/user"));
app.use("/images/post", express.static("images/post"));

app.listen(process.env.PORT, () =>
  console.log("Serveur démarré sur le port " + process.env.PORT)
);

module.exports = app;
