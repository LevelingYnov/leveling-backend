const { Event } = require('../models');
const moment = require('moment');

exports.readAll = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const events = await Event.findAll({
            where: { id_users: userId }
        });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lire un événement par son ID
exports.read = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const eventId = req.params.id;

        const event = await Event.findOne({
            where: {
                id: eventId,
                id_users: userId
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé.' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { event_type, start_time, end_time } = req.body;

        // Vérification des données envoyées
        if (!event_type || !start_time || !end_time) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }

        // Vérification que start_time et end_time sont au format valide (hh:mm:ss)
        const startTimeMoment = moment(start_time, 'HH:mm:ss', true);
        const endTimeMoment = moment(end_time, 'HH:mm:ss', true);

        if (!startTimeMoment.isValid() || !endTimeMoment.isValid()) {
            return res.status(400).json({ message: 'Les heures de début et de fin doivent être valides au format hh:mm:ss.' });
        }

        // Si les heures sont valides, formatage en TIME (hh:mm:ss)
        const formattedStartTime = startTimeMoment.format('HH:mm:ss');
        const formattedEndTime = endTimeMoment.format('HH:mm:ss');

        // Créer l'événement
        const event = await Event.create({
            event_type,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            id_users: userId
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { start_time, end_time } = req.body;

        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé.' });
        }

        // Validation et formatage des heures
        let formattedStartTime = event.start_time;
        let formattedEndTime = event.end_time;

        // Validation des heures de début et de fin
        if (start_time) {
            const startTimeMoment = moment(start_time, 'HH:mm:ss', true);
            if (!startTimeMoment.isValid()) {
                return res.status(400).json({ message: 'L\'heure de début doit être valide au format hh:mm:ss.' });
            }
            formattedStartTime = startTimeMoment.format('HH:mm:ss');
        }

        if (end_time) {
            const endTimeMoment = moment(end_time, 'HH:mm:ss', true);
            if (!endTimeMoment.isValid()) {
                return res.status(400).json({ message: 'L\'heure de fin doit être valide au format hh:mm:ss.' });
            }
            formattedEndTime = endTimeMoment.format('HH:mm:ss');
        }

        // Mise à jour de l'événement
        event.start_time = formattedStartTime;
        event.end_time = formattedEndTime;

        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un événement
exports.delete = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé.' });
        }

        await event.destroy();

        res.status(200).json({ message: 'Événement supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};