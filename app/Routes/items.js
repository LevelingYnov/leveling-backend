const express = require('express');
const router = express();
const itemsCtrl = require("../controllers/items.js");
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");

/**
 * Les différentes routes pour les items.
 * 
 * @module routes
 */
router.get("/", authMiddleware, itemsCtrl.readAll);
router.get("/:id", authMiddleware, itemsCtrl.read);

/**
 * Les différentes routes admins pour les items.
 * 
 * @module routes
 */
router.post("/", authMiddleware, authorizeAdminMiddleware, itemsCtrl.create);
router.put("/:id", authMiddleware, authorizeAdminMiddleware, itemsCtrl.update);
router.delete("/:id", authMiddleware, authorizeAdminMiddleware, itemsCtrl.delete);

module.exports = router;