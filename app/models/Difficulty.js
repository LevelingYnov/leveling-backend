const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Difficulty', {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        multiplicator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le multiplicateur est obligatoire.' },
                isInt: { msg: 'Le multiplicateur doit être un entier.' }
            }
        }
    }, {
        tableName: 'Difficulty',
        timestamps: false
    });
};
