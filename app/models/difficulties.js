'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Difficulty extends Model {
        static associate(models) {
            
        }
    }
    Difficulty.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Le nom de la difficulté doit être unique.'
            },
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' },
                notEmpty: { msg: 'Le nom ne peut pas être vide.' }
            }
        },
        multiplicator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le multiplicateur est obligatoire.' },
                isInt: { msg: 'Le multiplicateur doit être un entier.' },
                min: { args: [1], msg: 'Le multiplicateur doit être supérieur ou égal à 1.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Difficulty',
        tableName: 'difficulties'
    });

    return Difficulty;
};