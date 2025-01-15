const { Pallier } = require('../../models'); // Assurez-vous que le modèle est correctement importé

// Récupérer tous les palliers
exports.getAllPalliers = async (req, res) => {
    try {
        const palliers = await Pallier.findAll();
        res.status(200).json(palliers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des palliers.', error });
    }
};

// Récupérer un pallier par ID
exports.getPallierById = async (req, res) => {
    const { id } = req.params;
    try {
        const pallier = await Pallier.findByPk(id);
        if (!pallier) {
            return res.status(404).json({ message: 'Pallier non trouvé.' });
        }
        res.status(200).json(pallier);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du pallier.', error });
    }
};
