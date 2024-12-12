const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('MissionsDifficulty', {
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        fk_difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La difficult� est obligatoire.' }
            }
        }
    }, {
        tableName: 'Missions_Difficulty',
        timestamps: false
    });
};
