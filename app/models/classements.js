'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Classement extends Model {
        static associate(models) {
            Classement.belongsTo(models.User, { foreignKey: 'fk_user', as: 'user' });
        }
    }
    Classement.init({
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le numéro est obligatoire.' },
                isInt: { msg: 'Le numéro doit être un entier.' }
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
        modelName: 'Classement',
        tableName: 'classements'
    });

    return Classement;
};