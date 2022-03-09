const express = require("express");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")
require("dotenv").config({ path: "./config/.env" });
const db = require('./config/db')
const cors = require("cors");

const app = express();

const corsOptions = {
  // origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

db.connect(function (err) {
  if (err) throw err;
  console.log("Base de données initialisée");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/images/user", express.static("images/user"));
app.use("/images/post", express.static("images/post"));



app.listen(process.env.PORT, () =>
  console.log("Serveur démarré sur le port " + process.env.PORT)
);

module.exports = app;
