const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('PallierUsers', {
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_pallier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le pallier est obligatoire.' }
            }
        }
    }, {
        tableName: 'Pallier_Users',
        timestamps: false
    });
};
