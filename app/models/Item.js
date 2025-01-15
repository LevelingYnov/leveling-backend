const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Item', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        bonus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le bonus est obligatoire.' },
                isInt: { msg: 'Le bonus doit �tre un entier.' }
            }
        }
    }, {
        tableName: 'Items',
        timestamps: false
    });
};
