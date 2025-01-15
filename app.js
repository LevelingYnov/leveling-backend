const express = require('express');
const app = express();
const router = require("./app/Routes/index.js");
const db = require("./app/models/index.js");

db.sequelize
    .authenticate()
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(err));

app.use(express.json());
app.use("/api", router);

module.exports = app;