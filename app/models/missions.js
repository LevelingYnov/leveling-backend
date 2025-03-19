'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Mission extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Mission.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        description: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['quest', 'penality', 'exo', 'defi']], msg: 'Le statut doit être quest, penality, exo ou defi.' }
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Les points sont obligatoires.' },
                isInt: { msg: 'Les points doivent être un entier.' }
            }
        },
        limit_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minimum_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Mission',
        tableName: 'missions',
        timestamps: false
    });

    return Mission;
};
