const express = require('express');
const router = express();
const defiCtrl = require('../controllers/defi.js');
const authMiddleware = require('../middlewares/auth.js');

/**
 * Routes pour gérer les defis.
 */
router.get('/getLastUserDefi', authMiddleware, defiCtrl.getLastUserDefi);
router.post('/', authMiddleware, defiCtrl.create);
router.get('/', authMiddleware, defiCtrl.actif);
router.delete('/:id', authMiddleware, defiCtrl.delete);

module.exports = router;