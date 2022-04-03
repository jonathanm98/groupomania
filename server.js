const express = require("express");
const https = require("https");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")
require("dotenv").config({ path: "./config/.env" });
const db = require('./config/db')
const cors = require("cors");
const fs = require("fs");
const cert = fs.readFileSync("./config/ssl/cert.pem", "utf8");
const key = fs.readFileSync("./config/ssl/key.pem", "utf8");
const credentials = { key: key, cert: cert };
const { xss } = require('express-xss-sanitizer');

const app = express();
const httpsServer = https.createServer(credentials, app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(xss())

db.connect(function (err) {
  if (err) throw err;
  console.log("Base de données initialisée");
});


app.use("/api/user", authRoutes);
app.use("/api/post", postRoutes);
app.use("/images/user", express.static("images/user"));
app.use("/images/post", express.static("images/post"));

app.listen(process.env.PORT, () =>
  console.log("Serveur démarré sur le port " + process.env.PORT)
);

module.exports = app;
