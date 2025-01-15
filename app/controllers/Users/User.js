const { User } = require('../../models'); // Assurez-vous que le modèle est correctement importé

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.', error });
    }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    const { email, username, password, avatar, poids, taille, experience, points, abonnement } = req.body;
    try {
        const newUser = await User.create({ email, username, password, avatar, poids, taille, experience, points, abonnement });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'utilisateur.', error });
    }
};

// Mettre à jour un utilisateur existant
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, username, password, avatar, poids, taille, experience, points, abonnement } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        await user.update({ email, username, password, avatar, poids, taille, experience, points, abonnement });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.', error });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        await user.destroy();
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.', error });
    }
};
