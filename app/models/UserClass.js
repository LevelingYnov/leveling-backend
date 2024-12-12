const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserClass', {
        fk_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_classes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La classe est obligatoire.' }
            }
        }
    }, {
        tableName: 'User_Classes',
        timestamps: false
    });
};
