const express = require('express');
const router = express();
const inventoriesCtrl = require("../controllers/inventories.js");
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");

/**
 * Les différentes routes pour les inventories.
 * 
 * @module routes
 */
router.post("/", authMiddleware, inventoriesCtrl.addItem)
router.get("/", authMiddleware, inventoriesCtrl.readOwn);

/**inven
 * Les différentes routes admins pour les inventories.
 * 
 * @module routes
 */
router.get("/readAll", authMiddleware, authorizeAdminMiddleware, inventoriesCtrl.readAll);
router.get("/:id", authMiddleware, authorizeAdminMiddleware, inventoriesCtrl.read);
router.delete("/:id", authMiddleware, inventoriesCtrl.removeItem);

module.exports = router;