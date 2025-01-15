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
        STRINGe: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le STRINGe est obligatoire.' }
            }
        },
        notification_type: {
            type: DataTypes.STRING,
            defaultValue: 'MISSION',
            validate: {
                isIn: { args: [['MISSION', 'REMINDER', 'SYSTEM', 'EVENT']], msg: 'Le type de notification doit �tre valide.' }
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
