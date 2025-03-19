const express = require('express');
const router = express();
const authCtrl = require("../controllers/auth.js");
const normalizeEmailMiddleware = require('../middlewares/normalizeEmail');
const generateAvatar = require('../middlewares/generateAvatar');

router.post("/signup", generateAvatar, authCtrl.signup);
router.post("/login", normalizeEmailMiddleware, authCtrl.login);
router.post("/refreshToken", authCtrl.refreshToken);
router.post("/logout", authCtrl.logout);
router.post('/reset-password', normalizeEmailMiddleware, authCtrl.requestPasswordReset);
router.post('/reset', authCtrl.resetPassword);

module.exports = router;