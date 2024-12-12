const express = require('express');
const app = express();
const router = require("./app/routes/index.js");
const path = require('path');

const db = require("./app/models/index.js");
db.sequelize
    .authenticate()
    .then(() => console.log("Database connected ..."))
    .catch((err) => console.log(err));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

module.exports = app;