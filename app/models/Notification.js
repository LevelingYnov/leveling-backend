const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Notification', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        event_id: DataTypes.INTEGER,
        texte: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le texte est obligatoire.' }
            }
        },
        notification_type: {
            type: DataTypes.TEXT,
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
        tableName: 'Notifications',
        timestamps: false
    });
};
