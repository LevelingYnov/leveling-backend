
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserMission extends Model {
        static associate(models) {
            UserMission.belongsTo(models.User, { foreignKey: 'fk_users', as: 'user' });
            UserMission.belongsTo(models.Mission, { foreignKey: 'fk_missions', as: 'mission' });
            UserMission.belongsTo(models.Difficulty, { foreignKey: 'fk_difficulty', as: 'difficulty' });
        }
    }
    UserMission.init({
        fk_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'missions',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        fk_difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: { model: 'difficulties', key: 'id' }
        },
        starttime: DataTypes.DATE,
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['PASSED', 'FAILED']], msg: 'Le statut doit être PASSED ou FAILED.' }
            }
        }
    }, {
        sequelize,
        modelName: 'UserMission',
        tableName: 'user_missions',
        timestamps: false
    });

    return UserMission;
};
