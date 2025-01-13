const { Pallier } = require('../models'); // Assurez-vous que le modèle est correctement importé

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

// Créer un nouveau pallier
exports.createPallier = async (req, res) => {
    const { name, point_pallier } = req.body;
    try {
        const newPallier = await Pallier.create({ name, point_pallier });
        res.status(201).json(newPallier);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du pallier.', error });
    }
};

// Mettre à jour un pallier existant
exports.updatePallier = async (req, res) => {
    const { id } = req.params;
    const { name, point_pallier } = req.body;
    try {
        const pallier = await Pallier.findByPk(id);
        if (!pallier) {
            return res.status(404).json({ message: 'Pallier non trouvé.' });
        }
        await pallier.update({ name, point_pallier });
        res.status(200).json(pallier);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du pallier.', error });
    }
};

// Supprimer un pallier
exports.deletePallier = async (req, res) => {
    const { id } = req.params;
    try {
        const pallier = await Pallier.findByPk(id);
        if (!pallier) {
            return res.status(404).json({ message: 'Pallier non trouvé.' });
        }
        await pallier.destroy();
        res.status(200).json({ message: 'Pallier supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du pallier.', error });
    }
};