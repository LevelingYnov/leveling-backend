const { Difficulty } = require('../models');

/**
 * Récupérer toutes les difficultés.
 */
exports.readAll = async (req, res) => {
    try {
        const difficulties = await Difficulty.findAll();
        res.status(200).json(difficulties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Récupérer une difficulté spécifique par ID.
 */
exports.read = async (req, res) => {
    try {
        const difficulty = await Difficulty.findByPk(req.params.id);
        if (!difficulty) {
            return res.status(404).json({ message: 'Difficulté non trouvée.' });
        }
        res.status(200).json(difficulty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Créer une nouvelle difficulté.
 */
exports.create = async (req, res) => {
    try {
        const { name, multiplicator } = req.body;

        if (!name || !multiplicator) {
            return res.status(400).json({ message: 'Le nom et le multiplicateur sont obligatoires.' });
        }

        const existingDifficulty = await Difficulty.findOne({ where: { name } });
        if (existingDifficulty) {
            return res.status(400).json({ message: 'Une difficulté avec ce nom existe déjà.' });
        }

        const newDifficulty = await Difficulty.create({
            name,
            multiplicator
        });

        res.status(201).json({ message: 'Difficulté créée avec succès', difficulty: newDifficulty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Mettre à jour une difficulté existante.
 */
exports.update = async (req, res) => {
    try {
        const { name, multiplicator } = req.body;
        const difficulty = await Difficulty.findByPk(req.params.id);

        if (!difficulty) {
            return res.status(404).json({ message: 'Difficulté non trouvée.' });
        }

        // Mettre à jour les informations
        difficulty.name = name || difficulty.name;
        difficulty.multiplicator = multiplicator || difficulty.multiplicator;

        await difficulty.save();

        res.status(200).json({ message: 'Difficulté mise à jour avec succès', difficulty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Supprimer une difficulté.
 */
exports.delete = async (req, res) => {
    try {
        const difficulty = await Difficulty.findByPk(req.params.id);

        if (!difficulty) {
            return res.status(404).json({ message: 'Difficulté non trouvée.' });
        }

        await difficulty.destroy();
        res.status(200).json({ message: 'Difficulté supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};