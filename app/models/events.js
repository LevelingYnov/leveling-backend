'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            Event.belongsTo(models.Mission, { foreignKey: 'id_missions', as: 'mission' });
        }
    }
    Event.init({
        id_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            },
            references: {
                model: 'missions',
                key: 'id'
            }
        },
        event_type: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['MISSION_STARTED', 'MISSION_COMPLETED', 'REMINDER']], msg: 'Le type d\'évènement doit être valide.' }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'events'
    });

    return Event;
};
