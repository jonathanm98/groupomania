require("dotenv").config({ path: "./config/.env" });
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "projet7_limited",
  password: process.env.DB_PASSWORD,
  database: "groupomania",
  multipleStatements: true,
});

module.exports = con;
