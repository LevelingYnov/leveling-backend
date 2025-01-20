'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PallierUsers extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    PallierUsers.init({
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_pallier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le pallier est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'PallierUsers',
        tableName: 'pallier_users'
    });
};
