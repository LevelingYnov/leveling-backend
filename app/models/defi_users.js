'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DefiUsers extends Model {
        static associate(models) {
            DefiUsers.belongsTo(models.User, { foreignKey: 'fk_user', as: 'user1' });
            DefiUsers.belongsTo(models.User, { foreignKey: 'fk_user2', as: 'user2' });
            DefiUsers.belongsTo(models.Mission, { foreignKey: 'fk_missions', as: 'mission' });
        }
    }
    DefiUsers.init({
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_user2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le deuxième utilisateur est obligatoire.' },
                notEqual(value) {
                    if (value === this.fk_user) {
                        throw new Error('Les utilisateurs doivent être différents.');
                    }
                }
            }
        },
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        }
    }, {
        sequelize,
        modelName: 'DefiUsers',
        tableName: 'defi_users'
    });

    return DefiUsers;
};