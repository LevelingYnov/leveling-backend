'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DefiUsers extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    DefiUsers.init({
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_user2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le deuxi�me utilisateur est obligatoire.' }
            }
        },
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'DefiUsers',
        tableName: 'defi_users'
    });
};
