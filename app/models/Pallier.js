const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pallier', {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        point_pallier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le point pallier est obligatoire.' },
                isInt: { msg: 'Le point pallier doit être un entier.' }
            }
        }
    }, {
        tableName: 'Pallier',
        timestamps: false
    });
};
