const { UserMission } = require('../../models'); // Assurez-vous que le modèle est correctement importé

// Récupérer toutes les missions des utilisateurs
exports.getAllUserMissions = async (req, res) => {
    try {
        const userMissions = await UserMission.findAll();
        res.status(200).json(userMissions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions des utilisateurs.', error });
    }
};

// Récupérer les missions par utilisateur
exports.getUserMissionsByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const userMissions = await UserMission.findAll({ where: { fk_users: user_id } });
        if (userMissions.length === 0) {
            return res.status(404).json({ message: 'Aucune mission trouvée pour cet utilisateur.' });
        }
        res.status(200).json(userMissions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions pour cet utilisateur.', error });
    }
};

// Récupérer les missions par mission ID
exports.getUserMissionsByMissionId = async (req, res) => {
    const { mission_id } = req.params;
    try {
        const userMissions = await UserMission.findAll({ where: { fk_missions: mission_id } });
        if (userMissions.length === 0) {
            return res.status(404).json({ message: 'Aucune mission trouvée pour cette mission.' });
        }
        res.status(200).json(userMissions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions pour cette mission.', error });
    }
};

// Créer une nouvelle mission pour un utilisateur
exports.createUserMission = async (req, res) => {
    const { fk_users, fk_missions, starttime, status } = req.body;
    try {
        const newUserMission = await UserMission.create({ fk_users, fk_missions, starttime, status });
        res.status(201).json(newUserMission);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la mission utilisateur.', error });
    }
};

// Mettre à jour le statut d'une mission utilisateur
exports.updateUserMissionStatus = async (req, res) => {
    const { user_id, mission_id } = req.params;
    const { status } = req.body;
    try {
        const userMission = await UserMission.findOne({ where: { fk_users: user_id, fk_missions: mission_id } });
        if (!userMission) {
            return res.status(404).json({ message: 'Mission utilisateur non trouvée.' });
        }
        userMission.status = status;
        await userMission.save();
        res.status(200).json(userMission);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la mission utilisateur.', error });
    }
};

// Supprimer une mission utilisateur
exports.deleteUserMission = async (req, res) => {
    const { user_id, mission_id } = req.params;
    try {
        const userMission = await UserMission.findOne({ where: { fk_users: user_id, fk_missions: mission_id } });
        if (!userMission) {
            return res.status(404).json({ message: 'Mission utilisateur non trouvée.' });
        }
        await userMission.destroy();
        res.status(200).json({ message: 'Mission utilisateur supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la mission utilisateur.', error });
    }
};
