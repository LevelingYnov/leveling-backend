const { UserClass } = require('../models'); // Assurez-vous que le modèle est correctement importé

// Récupérer toutes les associations Utilisateur-Classe
exports.getAllUserClasses = async (req, res) => {
    try {
        const userClasses = await UserClass.findAll();
        res.status(200).json(userClasses);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des associations Utilisateur-Classe.', error });
    }
};

// Récupérer les associations par utilisateur
exports.getUserClassesByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const userClasses = await UserClass.findAll({ where: { fk_users: user_id } });
        if (userClasses.length === 0) {
            return res.status(404).json({ message: 'Aucune association trouvée pour cet utilisateur.' });
        }
        res.status(200).json(userClasses);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des associations pour cet utilisateur.', error });
    }
};

// Créer une nouvelle association Utilisateur-Classe
exports.createUserClass = async (req, res) => {
    const { fk_users, fk_classes } = req.body;
    try {
        const newUserClass = await UserClass.create({ fk_users, fk_classes });
        res.status(201).json(newUserClass);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'association Utilisateur-Classe.', error });
    }
};

// Supprimer une association Utilisateur-Classe
exports.deleteUserClass = async (req, res) => {
    const { user_id, class_id } = req.params;
    try {
        const userClass = await UserClass.findOne({ where: { fk_users: user_id, fk_classes: class_id } });
        if (!userClass) {
            return res.status(404).json({ message: 'Association Utilisateur-Classe non trouvée.' });
        }
        await userClass.destroy();
        res.status(200).json({ message: 'Association Utilisateur-Classe supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'association Utilisateur-Classe.', error });
    }
};
