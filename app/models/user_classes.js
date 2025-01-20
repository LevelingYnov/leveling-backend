'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserClasses extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    UserClasses.init({
        fk_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_classes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La classe est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'UserClasses',
        tableName: 'user_classes'
    });
};
