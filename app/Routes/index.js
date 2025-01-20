const express = require('express')
const router = express();
const authRoutes = require('./auth.js');

/**
 * Les différentes routes de l'application sont définies ici et reliées à leur fichier respectif.
 * 
 * @module routes
 */
router.use("/auth", authRoutes);

module.exports = router;