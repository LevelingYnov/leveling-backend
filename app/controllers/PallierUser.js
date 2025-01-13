const { PallierUsers } = require('../models'); // Assurez-vous que le modèle est correctement importé

// Récupérer toutes les associations Pallier-Utilisateur
exports.getAllPallierUsers = async (req, res) => {
    try {
        const pallierUsers = await PallierUsers.findAll();
        res.status(200).json(pallierUsers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des associations Pallier-Utilisateur.', error });
    }
};

// Récupérer les associations Pallier-Utilisateur par utilisateur
exports.getPallierUsersByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const pallierUsers = await PallierUsers.findAll({ where: { fk_user: user_id } });
        if (pallierUsers.length === 0) {
            return res.status(404).json({ message: 'Aucune association trouvée pour cet utilisateur.' });
        }
        res.status(200).json(pallierUsers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des associations pour cet utilisateur.', error });
    }
};

// Créer une nouvelle association Pallier-Utilisateur
exports.createPallierUser = async (req, res) => {
    const { fk_user, fk_pallier } = req.body;
    try {
        const newPallierUser = await PallierUsers.create({ fk_user, fk_pallier });
        res.status(201).json(newPallierUser);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'association Pallier-Utilisateur.', error });
    }
};

// Supprimer une association Pallier-Utilisateur
exports.deletePallierUser = async (req, res) => {
    const { user_id, pallier_id } = req.params;
    try {
        const pallierUser = await PallierUsers.findOne({ where: { fk_user: user_id, fk_pallier: pallier_id } });
        if (!pallierUser) {
            return res.status(404).json({ message: 'Association Pallier-Utilisateur non trouvée.' });
        }
        await pallierUser.destroy();
        res.status(200).json({ message: 'Association Pallier-Utilisateur supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'association Pallier-Utilisateur.', error });
    }
};