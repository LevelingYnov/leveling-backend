const { Mission } = require('../../models'); // Assurez-vous que le modèle est bien importé

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
