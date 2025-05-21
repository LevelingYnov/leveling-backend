const express = require('express');
const router = express();
const authMiddleware = require("../middlewares/auth.js");
const authorizeAdminMiddleware = require("../middlewares/authorizeAdmin.js");
const getRandomItemMiddleware  = require("../middlewares/dropItemMiddleware");
const missionsCtrl = require("../controllers/missions.js");

/**
 * Les différentes routes pour les items.
 * 
 * @module routes
 */
router.post("/trigger", authMiddleware, missionsCtrl.triggerMissionFromEvent);
router.post('/assign', authMiddleware, missionsCtrl.assignMissionToUser);
router.post('/status', authMiddleware, getRandomItemMiddleware, missionsCtrl.checkMissionStatus);
router.get("/logs", authMiddleware, missionsCtrl.logsUserMission);

// /**
//  * Les différentes routes admins pour les items.
//  * 
//  * @module routes
//  */
router.get('/:id', authMiddleware, authorizeAdminMiddleware, missionsCtrl.read);
router.get('/', authMiddleware, authorizeAdminMiddleware, missionsCtrl.readAll);
router.post('/', authMiddleware, authorizeAdminMiddleware, missionsCtrl.create);
router.put('/:id', authMiddleware, authorizeAdminMiddleware, missionsCtrl.update);
router.delete('/:id', authMiddleware, authorizeAdminMiddleware, missionsCtrl.delete);

module.exports = router;