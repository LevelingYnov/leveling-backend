const { Item } = require('../../models'); // Assurez-vous que le modèle Item est correctement importé

// Récupérer tous les items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des items.', error });
    }
};

// Récupérer un item par son ID
exports.getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item non trouvé.' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'item.', error });
    }
};

// Créer un nouvel item
exports.createItem = async (req, res) => {
    const { name, bonus } = req.body;
    try {
        const newItem = await Item.create({ name, bonus });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'item.', error });
    }
};

// Mettre à jour un item existant
exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, bonus } = req.body;
    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item non trouvé.' });
        }
        await item.update({ name, bonus });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'item.', error });
    }
};

// Supprimer un item
exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item non trouvé.' });
        }
        await item.destroy();
        res.status(200).json({ message: 'Item supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'item.', error });
    }
};