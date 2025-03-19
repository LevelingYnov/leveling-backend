'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Notification.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        event_id: DataTypes.INTEGER,
        message: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le message est obligatoire.' }
            }
        },
        notification_type: {
            type: DataTypes.STRING,
            defaultValue: 'MISSION',
            validate: {
                isIn: { args: [['MISSION', 'REMINDER', 'SYSTEM', 'EVENT']], msg: 'Le type de notification doit être valide.' }
            }
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Notification',
        tableName: 'notifications',
        timestamps: false
    });

    return Notification;
};
