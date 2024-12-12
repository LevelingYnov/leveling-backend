const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Event', {
        id_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        event_type: {
            type: DataTypes.TEXT,
            validate: {
                isIn: { args: [['MISSION_STARTED', 'MISSION_COMPLETED', 'REMINDER']], msg: 'Le type d\'événement doit être valide.' }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Events',
        timestamps: false
    });
};
