const express = require('express');
const router = express();
const notificationsCtrl = require("../controllers/notifications.js");
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");

/**
 * Les différentes routes pour les items.
 * 
 * @module routes
 */
router.get("/:id", authMiddleware, notificationsCtrl.read);

/**
 * Les différentes routes admins pour les items.
 * 
 * @module routes
 */
router.get("/", authMiddleware, authorizeAdminMiddleware, notificationsCtrl.readAll);
router.post("/", authMiddleware, authorizeAdminMiddleware, notificationsCtrl.create);
router.put("/:id", authMiddleware, authorizeAdminMiddleware, notificationsCtrl.update);
router.delete("/:id", authMiddleware, authorizeAdminMiddleware, notificationsCtrl.delete);

module.exports = router;