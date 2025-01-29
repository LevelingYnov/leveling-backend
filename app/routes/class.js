const express = require('express');
const router = express();
const classCtrl = require("../controllers/class.js");
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");

router.get("/", authMiddleware, classCtrl.read);
router.get("/readAll", authMiddleware, classCtrl.readAll);
router.post("/", authMiddleware, authorizeAdminMiddleware, classCtrl.create);
router.post("/assignUser", authMiddleware, authorizeAdminMiddleware, classCtrl.assignUserToClass);
router.get("/:classId/users", authMiddleware, authorizeAdminMiddleware, classCtrl.getUsersByClass);
router.post("/assign/:classId", authMiddleware, classCtrl.assignClass);
router.put("/:id", authMiddleware, authorizeAdminMiddleware, classCtrl.update);
router.delete("/:id", authMiddleware, authorizeAdminMiddleware, classCtrl.delete);
router.delete("/:classId/remove/:userId", authMiddleware, authorizeAdminMiddleware, classCtrl.removeUserFromClass);

module.exports = router;