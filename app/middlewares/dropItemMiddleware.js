const { Item } = require('../models');

async function getRandomItemMiddleware(req, res, next) {
    try {
        const items = await Item.findAll();
        
        if (items.length === 0) {
            req.droppedItem = null;
            return next();
        }

        for (const item of items) {
            const dropRate = getDropRate(item.bonus);
            if (Math.random() < dropRate) {
                req.droppedItem = item;
                break;
            }
        }

        next(); // Passer au contrôleur
    } catch (error) {
        next(error); // Gérer les erreurs
    }
}

function getDropRate(bonus) {
    if (bonus >= 51) return 1 / 1000; // 0.1%
    if (bonus >= 21) return 1 / 200;  // 0.5%
    if (bonus >= 11) return 1 / 50;   // 2%
    return 1 / 20;                    // 5%
}

module.exports = getRandomItemMiddleware;