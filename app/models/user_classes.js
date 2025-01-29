'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserClass extends Model {
        static associate(models) {
            UserClass.belongsTo(models.User, { foreignKey: 'fk_users', as: 'user' });
            UserClass.belongsTo(models.Class, { foreignKey: 'fk_classes', as: 'class' });
        }        
    }
    UserClass.init({
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
        fk_classes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'La classe est obligatoire.' }
            }
        }        
    }, {
        sequelize,
        modelName: 'UserClass',
        tableName: 'user_classes',
        timestamps: false
    });

    return UserClass;
};
