const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Classement', {
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le numéro est obligatoire.' },
                isInt: { msg: 'Le numéro doit être un entier.' }
            }
        },
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        }
    }, {
        tableName: 'Classement',
        timestamps: false
    });
};
