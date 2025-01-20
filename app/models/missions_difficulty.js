'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MissionsDifficulty extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    MissionsDifficulty.init({
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        fk_difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La difficult� est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'MissionsDifficulty',
        tableName: 'missions_difficulty'
    });
};
