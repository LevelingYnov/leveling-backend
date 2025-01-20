'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Items extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Items.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        bonus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le bonus est obligatoire.' },
                isInt: { msg: 'Le bonus doit �tre un entier.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Items',
        tableName: 'items'
    });
};
