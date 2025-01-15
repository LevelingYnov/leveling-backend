const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

router.post("/signup", users.signup); // Inscription
router.post("/login", users.login);   // Connexion

module.exports = router;