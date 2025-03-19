const { Notification } = require('../models');

// Lire une notification par ID
exports.read = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const notification = await Notification.findByPk(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ error: "Notification non trouvée" });
        }
        
        if (notification.user_id !== userId) {
            return res.status(403).json({ error: "Accès refusé : Cette notification ne vous appartient pas" });
        }
        
        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération de la notification" });
    }
};

// Lire toutes les notifications
exports.readAll = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
    }
};

// Créer une notification
exports.create = async (req, res) => {
    try {
        const { user_id, event_id, message, notification_type, is_read } = req.body;
        const newNotification = await Notification.create({
            user_id,
            event_id,
            message,
            notification_type,
            is_read
        });
        res.status(201).json(newNotification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de la notification" });
    }
};

// Mettre à jour une notification
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, notification_type, is_read } = req.body;

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification non trouvée" });
        }

        await notification.update({ message, notification_type, is_read });
        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la notification" });
    }
};

// Supprimer une notification
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification non trouvée" });
        }

        await notification.destroy();
        res.status(200).json({ message: "Notification supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression de la notification" });
    }
};
