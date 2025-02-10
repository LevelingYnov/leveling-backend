'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Item extends Model {
        static associate(models) {
            // Item.belongsToMany(models.Inventorie, { 
            //     through: 'InventorieItems', 
            //     foreignKey: 'fk_item',
            //     otherKey: 'fk_inventory',
            //     as: 'inventories' 
            // });
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
        tableName: 'items',
        timestamps: false
    });

    return Item;
};
