'use strict';
const { Model } = require('sequelize');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            Event.belongsTo(models.User, { foreignKey: 'id_users', as: 'user' });
        }
    }
    Event.init({
        id_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        event_type: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['MISSION', 'PENALITY']], msg: 'Le type d\'évènement doit être valide.' }
            }
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'events',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['id_users', 'event_type']
            }
        ],
        hooks: {
            beforeCreate: async (event, options) => {
                const existingEvent = await Event.findOne({
                    where: {
                        id_users: event.id_users,
                        event_type: event.event_type,
                        end_time: { [Op.gte]: new Date() }
                    }
                });

                if (existingEvent) {
                    throw new Error(`Un événement de type ${event.event_type} existe déjà pour cet utilisateur.`);
                }
            }
        }
    });

    return Event;
};