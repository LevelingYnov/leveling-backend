const express = require('express');
const router = express();
const classementCtrl = require("../controllers/classement.js");
const authMiddleware = require("../middlewares/auth.js");

router.post('/', authMiddleware, classementCtrl.refresh);
router.get("/", authMiddleware, classementCtrl.readAll);
router.get("/:id", authMiddleware, classementCtrl.read);

module.exports = router;