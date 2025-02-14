'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Pallier extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Pallier.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        point_pallier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le point pallier est obligatoire.' },
                isInt: { msg: 'Le point pallier doit être un entier.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Pallier',
        tableName: 'palliers',
        timestamps: false
    });

    return Pallier;
};
