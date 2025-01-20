'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Inventories extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Inventories.init({
        fk_items: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'item est obligatoire.' }
            }
        },
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Inventories',
        tableName: 'inventories'
    });
};
