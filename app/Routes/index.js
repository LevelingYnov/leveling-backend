const express = require('express')
const router = express();
const authRoutes = require('./auth.js');
const accountRoutes = require('./account.js');
const adminRoutes = require('./admin.js');

/**
 * Les différentes routes de l'application sont définies ici et reliées à leur fichier respectif.
 * 
 * @module routes
 */
router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/admin", adminRoutes);

module.exports = router;