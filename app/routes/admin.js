const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.js');
const authMiddleware = require("../middlewares/auth.js");
const normalizeEmailMiddleware = require('../middlewares/normalizeEmail');
const mutler = require('../middlewares/mutler.js');
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js"); // Importez le middleware d'autorisation

/**
 * @module routes/account
 * @description Ce module gère les routes relatives aux comptes utilisateurs, y compris la lecture, la mise à jour, et la suppression de comptes.
 */
router.post('/users', authMiddleware, normalizeEmailMiddleware, authorizeAdminMiddleware, mutler, adminCtrl.create);
router.put('/users/:id', authMiddleware, normalizeEmailMiddleware, authorizeAdminMiddleware, mutler, adminCtrl.update);
router.delete('/users/:id', authMiddleware, authorizeAdminMiddleware, adminCtrl.delete);

module.exports = router;