'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PallierUsers extends Model {
        static associate(models) {
            PallierUsers.belongsTo(models.User, { foreignKey: 'fk_user', as: 'user' });
            PallierUsers.belongsTo(models.Pallier, { foreignKey: 'fk_pallier', as: 'pallier' });
        }
    }
    PallierUsers.init({
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_pallier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'palliers',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'Le pallier est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'PallierUsers',
        tableName: 'pallier_users'
    });

    return PallierUsers;
};
