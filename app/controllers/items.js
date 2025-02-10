const { Item } = require('../models');

/**
 * Récupérer tous les items.
 */
exports.readAll = async (req, res) => {
    try {
        const items = await Item.findAll({ attributes: ['id', 'name'] });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des items." });
    }
};

/**
 * Récupérer un item par son ID.
 */
exports.read = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item non trouvé." });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'item." });
    }
};

/**
 * Créer un nouvel item.
 */
exports.create = async (req, res) => {
    try {
        const { name, bonus } = req.body;
        const newItem = await Item.create({ name, bonus });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Mettre à jour un item existant.
 */
exports.update = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item non trouvé." });
        }
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Supprimer un item.
 */
exports.delete = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item non trouvé." });
        }
        await item.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'item." });
    }
};
