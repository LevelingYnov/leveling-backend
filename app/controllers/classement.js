const { User, Classement } = require('../models');

exports.refresh = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs avec leurs points
        const users = await User.findAll({
            attributes: ['id', 'points'],
            order: [['points', 'DESC'], ['id', 'ASC']]  // Trier d'abord par points, ensuite par ID
        });

        // Supprimer tous les anciens classements
        await Classement.destroy({ where: {} });

        // Pour chaque utilisateur, mettre à jour ou créer un classement
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            await Classement.create({
                number: i + 1,
                fk_user: user.id
            });
        }

        res.status(200).json({ message: "Classement mis à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du classement." });
    }
};

/**
 * Récupérer tous les classements.
 */
exports.readAll = async (req, res) => {
    try {
        // Récupérer tous les classements
        const classements = await Classement.findAll({
            include: {
                model: User,
                attributes: ['id', 'username', 'points'],
                as: 'user'
            },
            order: [['number', 'ASC']]
        });

        res.status(200).json(classements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération du classement." });
    }
};

/**
 * Récupérer un classement par l'ID de l'utilisateur.
 */
exports.read = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer le classement de l'utilisateur par ID
        const classement = await Classement.findOne({
            where: { fk_user: id },
            include: {
                model: User,
                attributes: ['id', 'username', 'points'],
                as: 'user'
            }
        });

        if (!classement) {
            return res.status(404).json({ error: "Classement non trouvé pour cet utilisateur." });
        }

        res.status(200).json(classement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération du classement." });
    }
};