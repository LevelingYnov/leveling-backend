const express = require('express')
const router = express();
const authRoutes = require('./auth.js');
const accountRoutes = require('./account.js');
const adminRoutes = require('./admin.js');
const classRoutes = require('./class.js');
const itemsRoutes = require('./items.js');
const inventoriesRoutes = require('./inventories.js');
const classementRoutes = require('./classement.js');
const palliersRoutes = require('./palliers.js');
const missionsRoutes = require('./missions.js');
const difficultiesRoutes = require('./difficulty.js');
const eventRoutes = require('./events.js')
const defiRoutes = require('./defi.js');
const notificationRoutes = require('./notifications.js');

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
router.use("/palliers", palliersRoutes);
router.use("/missions", missionsRoutes);
router.use("/difficulty", difficultiesRoutes);
router.use("/events", eventRoutes);
router.use("/defis", defiRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;