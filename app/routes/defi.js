const express = require('express');
const router = express();
const defiCtrl = require('../controllers/defi.js');
const authMiddleware = require('../middlewares/auth.js');

/**
 * Routes pour gérer les defis.
 */
router.get('/:id', authMiddleware, defiCtrl.read);
router.post('/', authMiddleware, defiCtrl.create);
router.put('/:id', authMiddleware, defiCtrl.update);
router.delete('/:id', authMiddleware, defiCtrl.delete);

module.exports = router;