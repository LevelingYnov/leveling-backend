'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Defi extends Model {
        static associate(models) {
            Defi.belongsTo(models.User, { foreignKey: 'fk_defi_users', as: 'user' });
        }
    }
    Defi.init({
        code_user: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le code utilisateur est obligatoire.' },
                notEmpty: { msg: 'Le code utilisateur ne peut pas être vide.' }
            }
        },
        code_user2: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le code du deuxième utilisateur est obligatoire.' },
                notEmpty: { msg: 'Le code du deuxième utilisateur ne peut pas être vide.' }
            }
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: { msg: 'Le gagnant doit être un entier.' },
                min: 1,
                max: 2,  // Assure que le gagnant soit soit '1' (code_user) ou '2' (code_user2)
                isIn: { args: [[1, 2]], msg: 'Le gagnant doit être soit 1 (utilisateur 1) ou 2 (utilisateur 2).' }
            }
        },
        fk_defi_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La relation défi-utilisateur est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Defi',
        tableName: 'defis'
    });

    return Defi;
};