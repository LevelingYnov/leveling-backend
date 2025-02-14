const express = require('express');
const router = express();
const palliersCtrl = require("../controllers/palliers.js");
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");

/**
 * Les différentes routes pour les items.
 * 
 * @module routes
 */
router.get("/", authMiddleware, palliersCtrl.readAll);
router.get("/user", authMiddleware, palliersCtrl.getUserPallier);
router.get("/:id", authMiddleware, palliersCtrl.read);
router.post("/assign", authMiddleware, palliersCtrl.assignPallierToUser);

/**
 * Les différentes routes admins pour les items.
 * 
 * @module routes
 */
router.post("/", authMiddleware, authorizeAdminMiddleware, palliersCtrl.create);
router.put("/:id", authMiddleware, authorizeAdminMiddleware, palliersCtrl.update);
router.delete("/:id", authMiddleware, authorizeAdminMiddleware, palliersCtrl.delete);

module.exports = router;