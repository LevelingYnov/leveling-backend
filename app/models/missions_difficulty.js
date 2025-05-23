'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MissionsDifficulty extends Model {
        static associate(models) {
            MissionsDifficulty.belongsTo(models.Mission, { foreignKey: 'fk_missions', as: 'mission' });
            MissionsDifficulty.belongsTo(models.Difficulty, { foreignKey: 'fk_difficulty', as: 'difficulty' });
        }
    }
    MissionsDifficulty.init({
        fk_missions: {
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
        fk_difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La difficulté est obligatoire.' }
            },
            references: {
                model: 'difficulties',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'MissionsDifficulty',
        tableName: 'missions_difficulty',
        timestamps: false
    });

    return MissionsDifficulty;
};