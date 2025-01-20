'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Events extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Events.init({
        id_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        event_type: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['MISSION_STARTED', 'MISSION_COMPLETED', 'REMINDER']], msg: 'Le type d\'�v�nement doit �tre valide.' }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Events',
        tableName: 'events'
    });
};
