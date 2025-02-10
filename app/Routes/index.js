const express = require('express')
const router = express();
const authRoutes = require('./auth.js');
const accountRoutes = require('./account.js');
const adminRoutes = require('./admin.js');
const classRoutes = require('./class.js');
const itemsRoutes = require('./items.js');
const inventoriesRoutes = require('./inventories.js');
const classementRoutes = require('./classement.js');

/**
 * Les différentes routes de l'application sont définies ici et reliées à leur fichier respectif.
 * 
 * @module routes
 */
router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/admin", adminRoutes);
router.use("/class", classRoutes);
router.use("/items", itemsRoutes);
router.use("/inventories", inventoriesRoutes);
router.use("/classement", classementRoutes);

module.exports = router;