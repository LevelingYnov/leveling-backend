
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserMission extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    UserMission.init({
        fk_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        starttime: DataTypes.DATE,
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['PASSED', 'FAILED']], msg: 'Le statut doit �tre PASSED ou FAILED.' }
            }
        }
    }, {
        sequelize,
        modelName: 'UserMission',
        tableName: 'user_missions'
    });
};
