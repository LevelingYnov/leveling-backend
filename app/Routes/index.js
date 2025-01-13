const express = require('express')
const router = express();
const itemController = require('../controllers/Item');
const missionController = require('../controllers/Mission');
const MissionsDifficulty = require('../controllers/MissionsDifficulty');
const Notification = require('../controllers/Notification');
const Pallier = require('../controllers/Pallier');
const PallierUser = require('../controllers/PallierUser');
const User = require('../controllers/User');
const UserClass = require('../controllers/UserClass');
const UserMission = require('../controllers/UserMission');


// Routes pour les missions utilisateur
router.get('/user-missions', UserMission.getAllUserMissions); // Récupérer toutes les missions utilisateur
router.get('/user-missions/user/:user_id', UserMission.getUserMissionsByUserId); // Récupérer les missions par utilisateur
router.get('/user-missions/mission/:mission_id', UserMission.getUserMissionsByMissionId); // Récupérer les missions par mission
router.post('/user-missions', UserMission.createUserMission); // Créer une mission utilisateur
router.put('/user-missions/user/:user_id/mission/:mission_id', UserMission.updateUserMissionStatus); // Mettre à jour le statut d'une mission utilisateur
router.delete('/user-missions/user/:user_id/mission/:mission_id', UserMission.deleteUserMission); // Supprimer une mission utilisateur


// Routes pour les userClass
router.get('/user-classes', UserClass.getAllUserClasses); // Récupérer toutes les associations
router.get('/user-classes/user/:user_id', UserClass.getUserClassesByUserId); // Récupérer par utilisateur
router.post('/user-classes', UserClass.createUserClass); // Créer une association
router.delete('/user-classes/user/:user_id/class/:class_id', UserClass.deleteUserClass); // Supprimer une association


// Routes pour les utilisateurs
router.get('/users', User.getAllUsers); // Récupérer tous les utilisateurs
router.get('/users/:id', User.getUserById); // Récupérer un utilisateur par ID
router.post('/users', User.createUser); // Créer un utilisateur
router.put('/users/:id', User.updateUser); // Mettre à jour un utilisateur
router.delete('/users/:id', User.deleteUser); // Supprimer un utilisateur


// Routes pour les pallierUser
router.get('/pallier-users', PallierUser.getAllPallierUsers); // Récupérer toutes les associations
router.get('/pallier-users/user/:user_id', PallierUser.getPallierUsersByUserId); // Récupérer par utilisateur
router.post('/pallier-users', PallierUser.createPallierUser); // Créer une association
router.delete('/pallier-users/user/:user_id/pallier/:pallier_id', PallierUser.deletePallierUser); // Supprimer une association


// Routes pour les palliers
router.get('/palliers', Pallier.getAllPalliers); // Récupérer tous les palliers
router.get('/palliers/:id', Pallier.getPallierById); // Récupérer un pallier par ID
router.post('/palliers', Pallier.createPallier); // Créer un pallier
router.put('/palliers/:id', Pallier.updatePallier); // Mettre à jour un pallier
router.delete('/palliers/:id', Pallier.deletePallier); // Supprimer un pallier


// Routes pour les notifications
router.get('/notifications', Notification.getAllNotifications); // Récupérer toutes les notifications
router.get('/notifications/user/:user_id', Notification.getNotificationsByUserId); // Notifications par utilisateur
router.post('/notifications', Notification.createNotification); // Créer une notification
router.put('/notifications/:id', Notification.updateNotification); // Mettre à jour une notification
router.put('/notifications/:id/read', Notification.markAsRead); // Marquer une notification comme lue
router.delete('/notifications/:id', Notification.deleteNotification); // Supprimer une notification


// Définir les routes pour MissionsDifficulty
router.get('/missions-difficulties', MissionsDifficulty.getAllMissionsDifficulties);
router.get('/missions-difficulties/:id', MissionsDifficulty.getMissionsDifficultyById);
router.post('/missions-difficulties', MissionsDifficulty.createMissionsDifficulty);
router.put('/missions-difficulties/:id', MissionsDifficulty.updateMissionsDifficulty);
router.delete('/missions-difficulties/:id', MissionsDifficulty.deleteMissionsDifficulty);


// Définir les routes pour les missions
router.get('/missions', Mission.getAllMissions);
router.get('/missions/:id', Mission.getMissionById);
router.post('/missions', Mission.createMission);
router.put('/missions/:id', Mission.updateMission);
router.delete('/missions/:id', Mission.deleteMission);


// Définition des routes pour les items
router.get('/items', Item.getAllItems);
router.get('/items/:id', Item.getItemById);
router.post('/items', Item.createItem);
router.put('/items/:id', Item.updateItem);
router.delete('/items/:id', Item.deleteItem);


module.exports = router