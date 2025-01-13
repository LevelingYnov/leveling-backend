const { MissionsDifficulty } = require('../models'); // Assurez-vous que le modèle est correctement importé

// Récupérer toutes les relations Missions-Difficulty
exports.getAllMissionsDifficulties = async (req, res) => {
    try {
        const missionsDifficulties = await MissionsDifficulty.findAll();
        res.status(200).json(missionsDifficulties);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des relations Missions-Difficulty.', error });
    }
};

// Récupérer une relation Missions-Difficulty par ID
exports.getMissionsDifficultyById = async (req, res) => {
    const { id } = req.params;
    try {
        const missionsDifficulty = await MissionsDifficulty.findByPk(id);
        if (!missionsDifficulty) {
            return res.status(404).json({ message: 'Relation Missions-Difficulty non trouvée.' });
        }
        res.status(200).json(missionsDifficulty);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la relation Missions-Difficulty.', error });
    }
};

// Créer une nouvelle relation Missions-Difficulty
exports.createMissionsDifficulty = async (req, res) => {
    const { fk_missions, fk_difficulty } = req.body;
    try {
        const newMissionsDifficulty = await MissionsDifficulty.create({ fk_missions, fk_difficulty });
        res.status(201).json(newMissionsDifficulty);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la relation Missions-Difficulty.', error });
    }
};

// Mettre à jour une relation Missions-Difficulty existante
exports.updateMissionsDifficulty = async (req, res) => {
    const { id } = req.params;
    const { fk_missions, fk_difficulty } = req.body;
    try {
        const missionsDifficulty = await MissionsDifficulty.findByPk(id);
        if (!missionsDifficulty) {
            return res.status(404).json({ message: 'Relation Missions-Difficulty non trouvée.' });
        }
        await missionsDifficulty.update({ fk_missions, fk_difficulty });
        res.status(200).json(missionsDifficulty);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la relation Missions-Difficulty.', error });
    }
};

// Supprimer une relation Missions-Difficulty
exports.deleteMissionsDifficulty = async (req, res) => {
    const { id } = req.params;
    try {
        const missionsDifficulty = await MissionsDifficulty.findByPk(id);
        if (!missionsDifficulty) {
            return res.status(404).json({ message: 'Relation Missions-Difficulty non trouvée.' });
        }
        await missionsDifficulty.destroy();
        res.status(200).json({ message: 'Relation Missions-Difficulty supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la relation Missions-Difficulty.', error });
    }
};