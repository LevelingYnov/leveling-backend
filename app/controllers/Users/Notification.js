const { Notification } = require('../../models'); // Assurez-vous que le modèle est bien importé

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notifications.', error });
    }
};

// Récupérer les notifications par utilisateur
exports.getNotificationsByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const notifications = await Notification.findAll({ where: { user_id } });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notifications de l\'utilisateur.', error });
    }
};

// Créer une nouvelle notification
exports.createNotification = async (req, res) => {
    const { user_id, event_id, texte, notification_type, is_read } = req.body;
    try {
        const newNotification = await Notification.create({
            user_id,
            event_id,
            texte,
            notification_type,
            is_read
        });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la notification.', error });
    }
};

// Mettre à jour une notification existante
exports.updateNotification = async (req, res) => {
    const { id } = req.params;
    const { texte, notification_type, is_read } = req.body;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée.' });
        }
        await notification.update({ texte, notification_type, is_read });
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la notification.', error });
    }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée.' });
        }
        await notification.update({ is_read: true });
        res.status(200).json({ message: 'Notification marquée comme lue.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification.', error });
    }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée.' });
        }
        await notification.destroy();
        res.status(200).json({ message: 'Notification supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la notification.', error });
    }
};