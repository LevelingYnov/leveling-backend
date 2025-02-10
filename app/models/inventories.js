'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Inventorie extends Model {
        static associate(models) {
            Inventorie.belongsTo(models.User, { foreignKey: 'fk_user', as: 'user' });

            Inventorie.belongsToMany(models.Item, { 
                through: 'InventorieItems', 
                foreignKey: 'fk_inventory',
                otherKey: 'fk_item',
                as: 'items' 
            });
        }
    }
    Inventorie.init({
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            },
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Inventorie',
        tableName: 'inventories',
        timestamps: false
    });

    return Inventorie;
};