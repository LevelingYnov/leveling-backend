const express = require('express');
const router = express();
const authCtrl = require("../controllers/auth.js");
const normalizeEmailMiddleware = require('../middlewares/normalizeEmail');

router.post("/signup", authCtrl.signup);
router.post("/login", normalizeEmailMiddleware, authCtrl.login);
router.post("/logout", authCtrl.logout);

module.exports = router;