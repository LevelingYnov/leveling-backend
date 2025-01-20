'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Classes extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Classes.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Classes',
        tableName: 'classes'
    });
};
