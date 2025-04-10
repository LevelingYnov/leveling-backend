const { Inventorie, InventorieItems, Item, User } = require('../models');

/**
 * Récupérer tous les inventaires (admin seulement).
 */
exports.readAll = async (req, res) => {
    try {
        const inventories = await Inventorie.findAll({
            include: [
                {
                    model: Item,
                    as: 'items',
                    through: { attributes: ['quantity'] }
                },
                {
                    model: User,
                    as: 'user'
                }
            ]
        });
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des inventaires." });
    }
};

/**
 * Récupérer l'inventaire d'un utilisateur.
 */
exports.read = async (req, res) => {
    try {
        const inventory = await Inventorie.findAll({
            where: { fk_user: req.params.id },
            include: [
                {
                    model: Item,
                    as: 'items',   // Le nom de l'association est 'items', pas 'item'
                    through: { attributes: ['quantity'] }  // Inclure la quantité dans la table de jonction
                }
            ]
        });

        if (!inventory.length) {
            return res.status(404).json({ error: "Aucun inventaire trouvé pour cet utilisateur." });
        }

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'inventaire." });
    }
};

/**
 * Permettre à un utilisateur de voir uniquement son propre inventaire.
 */
exports.readOwn = async (req, res) => {
    try {
        const inventory = await Inventorie.findOne({
            where: { fk_user: req.auth.userId },
            include: ['items']
        });
        if (!inventory) {
            return res.status(404).json({ error: "Vous n'avez pas d'inventaire." });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de votre inventaire." });
    }
};

/**
 * Ajouter un item à l'inventaire d'un utilisateur.
 */
exports.addItem = async (req, res) => {
    try {
        // if (req.auth.userRole === 'User') {
        //     return res.status(403).json({ error: "Vous n'avez pas l'autorisation d'ajouter un item à un inventaire." });
        // }
        const { fk_items, fk_user } = req.body;
        const userId = fk_user;
        
        let inventory = await Inventorie.findOne({ where: { fk_user: userId } });
        if (!inventory) {
            inventory = await Inventorie.create({ fk_user: userId });
        }
        
        const item = await Item.findByPk(fk_items);
        if (!item) {
            return res.status(404).json({ error: "Item non trouvé." });
        }

        // Vérifier si l'item existe déjà dans l'inventaire
        let inventoryItem = await InventorieItems.findOne({
            where: {
                fk_inventory: inventory.id,
                fk_item: fk_items
            }
        });

        if (inventoryItem) {
            // Si l'item existe déjà, incrémenter la quantité
            inventoryItem.quantity += 1;
            await inventoryItem.save();
            return res.status(200).json({ message: "Quantité de l'item mise à jour." });
        } else {
            // Si l'item n'existe pas dans l'inventaire, l'ajouter avec une quantité de 1
            await inventory.addItem(item);
            return res.status(201).json({ message: "Item ajouté à l'inventaire." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        if (req.auth.userRole === 'User') {
            return res.status(403).json({ error: "Vous n'avez pas l'autorisation d'ajouter un item à un inventaire." });
        }

        const itemId = req.params.id;
        const userId = req.auth.userId;

        // Trouver l'inventaire de l'utilisateur
        const inventory = await Inventorie.findOne({
            where: { fk_user: userId },
            include: [
                {
                    model: Item,
                    as: 'items',   // Inclure les items de l'inventaire
                    through: { attributes: ['quantity'] }  // Inclure la quantité
                }
            ]
        });

        if (!inventory) {
            return res.status(404).json({ error: "Aucun inventaire trouvé pour cet utilisateur." });
        }

        // Chercher l'item spécifique dans l'inventaire
        const inventoryItem = await InventorieItems.findOne({
            where: {
                fk_inventory: inventory.id,
                fk_item: itemId  // Utilisation de itemId ici
            }
        });

        if (!inventoryItem) {
            return res.status(404).json({ error: "Cet item n'existe pas dans votre inventaire." });
        }

        // Vérifier si la quantité de l'item est plus grande que 1
        if (inventoryItem.quantity > 1) {
            // Si la quantité est plus grande que 1, on décrémente la quantité
            inventoryItem.quantity -= 1;
            await inventoryItem.save();
            return res.status(200).json({ message: "Quantité de l'item mise à jour." });
        } else {
            // Si la quantité est 1, on supprime totalement l'item de l'inventaire (supprimer l'enregistrement dans la table de jonction)
            await inventoryItem.destroy();
            return res.status(200).json({ message: "Item totalement supprimé de l'inventaire." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUserInventoryIfNoPoints = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return null;

        if (user.points <= 7) {
            const inventory = await Inventorie.findOne({ where: { fk_user: userId } });

            if (inventory) {
                await inventory.destroy();
                const message = `L'inventaire de l'utilisateur ${userId} a été supprimé car il n'a plus de points.`;
                return message;
            }
        }

        return null;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'inventaire :", error);
        return null;
    }
};
