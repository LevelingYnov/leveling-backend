const { Pallier, PallierUsers, User } = require('../models');
const { Op } = require('sequelize');

// Récupérer tous les paliers
exports.readAll = async (req, res) => {
    try {
        const palliers = await Pallier.findAll();
        res.status(200).json(palliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer le palier d'un utilisateur
exports.read = async (req, res) => {
    try {
        const { id } = req.params;
        const pallierUser = await PallierUsers.findOne({
            where: { fk_user: id },
            include: [{ model: Pallier, as: 'pallier' }]
        });
        if (!pallierUser) {
            return res.status(404).json({ message: 'Aucun palier trouvé pour cet utilisateur' });
        }
        res.status(200).json(pallierUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer le palier de l'utilisateur connecté
exports.getUserPallier = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const pallierUser = await PallierUsers.findOne({
            where: { fk_user: userId },
            include: [{ model: Pallier, as: 'pallier' }]
        });
        if (!pallierUser) {
            return res.status(404).json({ message: 'Aucun palier trouvé' });
        }
        res.status(200).json(pallierUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un palier
exports.create = async (req, res) => {
    try {
        const { name, point_pallier } = req.body;

        // Vérifier si un palier avec le même nom ou le même nombre de points existe déjà
        const existingPallier = await Pallier.findOne({
            where: {
                [Op.or]: [
                    { name },
                    { point_pallier }
                ]
            }
        });

        if (existingPallier) {
            return res.status(400).json({ message: 'Un palier avec ce nom ou ces points existe déjà' });
        }

        const pallier = await Pallier.create({ name, point_pallier });
        res.status(201).json(pallier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un palier
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, point_pallier } = req.body;
        const pallier = await Pallier.findByPk(id);

        if (!pallier) {
            return res.status(404).json({ message: 'Palier non trouvé' });
        }

        await pallier.update({ name, point_pallier });
        res.status(200).json({ message: 'Palier mis à jour avec succès', pallier });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un palier
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const pallier = await Pallier.findByPk(id);

        if (!pallier) {
            return res.status(404).json({ message: 'Palier non trouvé' });
        }
        await pallier.destroy();
        res.status(200).json({ message: 'Palier supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assigner ou mettre à jour le palier d'un utilisateur
exports.assignPallierToUser = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Trouver le palier le plus proche en dessous ou égal aux points de l'utilisateur
        const pallier = await Pallier.findOne({
            where: { point_pallier: { [Op.lte]: user.points } },
            order: [['point_pallier', 'DESC']]
        });

        // Vérifier si l'utilisateur a déjà un palier
        const existingAssignment = await PallierUsers.findOne({ where: { fk_user: userId } });
        
        if (!pallier) {
            // Si aucun palier ne correspond, supprimer l'ancien palier de l'utilisateur s'il en a un
            if (existingAssignment) {
                await existingAssignment.destroy();
                return res.status(200).json({ message: "L'utilisateur n'a plus de palier" });
            }
            return res.status(400).json({ message: 'Aucun palier disponible pour cet utilisateur' });
        }

        if (existingAssignment) {
            // Si l'utilisateur a déjà un palier, mettre à jour si c'est un palier différent
            if (existingAssignment.fk_pallier !== pallier.id) {
                await existingAssignment.update({ fk_pallier: pallier.id });
                return res.status(200).json({ message: 'Palier mis à jour avec succès' });
            }
            return res.status(200).json({ message: "L'utilisateur a déjà ce palier" });
        }

        // Assigner le nouveau palier
        await PallierUsers.create({ fk_user: userId, fk_pallier: pallier.id });
        res.status(201).json({ message: 'Palier assigné avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};