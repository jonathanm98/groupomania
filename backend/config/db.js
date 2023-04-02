require("dotenv").config({ path: "./.env" });
const mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "groupomania",
  multipleStatements: true,
});

module.exports = con;
