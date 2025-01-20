'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Item extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Item.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        bonus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le bonus est obligatoire.' },
                isInt: { msg: 'Le bonus doit être un entier.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Item',
        tableName: 'items'
    });

    return Item;
};
