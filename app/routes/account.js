const express = require('express');
const router = express();
const accountCtrl = require("../controllers/account.js");
const authMiddleware = require("../middlewares/auth.js");
const multer = require('../middlewares/mutler.js');
const normalizeEmailMiddleware = require('../middlewares/normalizeEmail.js');

/**
 * @module routes/account
 * @description Ce module gère les routes relatives aux comptes utilisateurs, y compris la lecture, la mise à jour, et la suppression de comptes.
 */
router.get("/", authMiddleware, accountCtrl.readAccount);
router.get("/users", authMiddleware, accountCtrl.readAll);
router.put("/update", authMiddleware, normalizeEmailMiddleware, multer, accountCtrl.update);
router.delete("/delete", authMiddleware, accountCtrl.delete);
router.get("/:id", authMiddleware, accountCtrl.read);

module.exports = router;