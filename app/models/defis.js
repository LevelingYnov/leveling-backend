'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Defi extends Model {
        static associate(models) {
            Defi.belongsTo(models.User, { foreignKey: 'fk_user1', as: 'user1' });
            Defi.belongsTo(models.User, { foreignKey: 'fk_user2', as: 'user2' });
            Defi.belongsTo(models.Mission, { foreignKey: 'fk_mission', as: 'mission' });
        }
    }

    Defi.init({
        code_defi: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            validate: {
                notEmpty: { msg: 'Le code du défi est obligatoire.' }
            }
        },
        fk_user1: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fk_user2: {
            type: DataTypes.INTEGER,
            allowNull: true // Null jusqu'à ce qu'un deuxième joueur rejoigne
        },
        fk_mission: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: true // Null jusqu'à ce qu'il y ait un gagnant
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'ACTIVE', 'FINISHED'),
            defaultValue: 'PENDING'
        }
    }, {
        sequelize,
        modelName: 'Defi',
        tableName: 'defis'
    });

    return Defi;
};