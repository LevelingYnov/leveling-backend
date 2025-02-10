'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        static associate(models) {
            
        }
    }
    Class.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' },
                len: { args: [3, 50], msg: 'Le nom doit contenir entre 3 et 50 caractères.' } // Validation de la longueur du nom
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Class',
        tableName: 'classes'
    });

    return Class;
};
