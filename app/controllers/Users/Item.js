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