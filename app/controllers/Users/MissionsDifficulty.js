const { MissionsDifficulty } = require('../../models'); // Assurez-vous que le modèle est correctement importé

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
