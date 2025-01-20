'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Inventorie extends Model {
        static associate(models) {
            Inventorie.belongsTo(models.Item, { foreignKey: 'fk_items', as: 'item' });
            Inventorie.belongsTo(models.User, { foreignKey: 'fk_user', as: 'user' });
        }
    }
    Inventorie.init({
        fk_items: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'item est obligatoire.' }
            },
            references: {
                model: 'items',
                key: 'id'
            }
        },
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
        tableName: 'inventories'
    });

    return Inventorie;
};
