'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InventorieItems extends Model {
        static associate(models) {
        }
    }

    InventorieItems.init({
        fk_inventory: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'inventories',
                key: 'id'
            }
        },
        fk_item: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'items',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        }
    }, {
        sequelize,
        modelName: 'InventorieItems',
        tableName: 'inventorie_items',
        timestamps: false
    });

    return InventorieItems;
};