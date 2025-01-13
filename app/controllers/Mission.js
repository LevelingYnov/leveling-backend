const { Mission } = require('../models'); // Assurez-vous que le modèle est bien importé

// Récupérer toutes les missions
exports.getAllMissions = async (req, res) => {
    try {
        const missions = await Mission.findAll();
        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions.', error });
    }
};

// Récupérer une mission par ID
exports.getMissionById = async (req, res) => {
    const { id } = req.params;
    try {
        const mission = await Mission.findByPk(id);
        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }
        res.status(200).json(mission);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la mission.', error });
    }
};

// Créer une nouvelle mission
exports.createMission = async (req, res) => {
    const { name, description, status, points } = req.body;
    try {
        const newMission = await Mission.create({ name, description, status, points });
        res.status(201).json(newMission);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la mission.', error });
    }
};

// Mettre à jour une mission existante
exports.updateMission = async (req, res) => {
    const { id } = req.params;
    const { name, description, status, points } = req.body;
    try {
        const mission = await Mission.findByPk(id);
        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }
        await mission.update({ name, description, status, points });
        res.status(200).json(mission);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la mission.', error });
    }
};

// Supprimer une mission
exports.deleteMission = async (req, res) => {
    const { id } = req.params;
    try {
        const mission = await Mission.findByPk(id);
        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }
        await mission.destroy();
        res.status(200).json({ message: 'Mission supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la mission.', error });
    }
};