const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const router = require("./app/routes/index.js");
const db = require("./app/models/index.js");

db.sequelize
    .authenticate()
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

module.exports = app;