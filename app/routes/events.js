const express = require('express');
const router = express();
const eventsCtrl = require("../controllers/events.js");
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");

/**
 * Les différentes routes pour les items.
 * 
 * @module routes
 */
router.get("/", authMiddleware, eventsCtrl.readAll);
router.get("/:id", authMiddleware, eventsCtrl.read);
router.post("/", authMiddleware, eventsCtrl.create);
router.put("/:id", authMiddleware, eventsCtrl.update);

/**
 * Les différentes routes admins pour les items.
 * 
 * @module routes
 */
router.delete("/:id", authMiddleware, authorizeAdminMiddleware, eventsCtrl.delete);

module.exports = router;