'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Difficulty extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Difficulty.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        multiplicator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le multiplicateur est obligatoire.' },
                isInt: { msg: 'Le multiplicateur doit �tre un entier.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Difficulty',
        tableName: 'difficulty'
    });
};
