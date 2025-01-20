'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        static associate(models) {
            // Exemple d'association : une classe pourrait avoir plusieurs utilisateurs
            // Class.hasMany(models.User, { foreignKey: 'class_id' });

            // Exemple d'association : une classe pourrait avoir plusieurs missions
            // Class.hasMany(models.Mission, { foreignKey: 'class_id' });
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
            type: DataTypes.TEXT, // Utilisation de TEXT si la description est longue
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Class',
        tableName: 'classes'
    });

    return Class;
};
