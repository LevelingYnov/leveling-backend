const express = require('express');
const router = express();
const difficultyCtrl = require('../controllers/difficulty.js');
const authMiddleware = require('../middlewares/auth.js');
const authorizeAdminMiddleware = require('../middlewares/authorizeAdmin.js');

/**
 * Routes pour gérer les difficultés.
 */
router.get('/:id', authMiddleware, authorizeAdminMiddleware, difficultyCtrl.read);
router.get('/', authMiddleware, authorizeAdminMiddleware, difficultyCtrl.readAll);
router.post('/', authMiddleware, authorizeAdminMiddleware, difficultyCtrl.create);
router.put('/:id', authMiddleware, authorizeAdminMiddleware, difficultyCtrl.update);
router.delete('/:id', authMiddleware, authorizeAdminMiddleware, difficultyCtrl.delete);

module.exports = router;