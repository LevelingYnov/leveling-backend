const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Class', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        description: DataTypes.STRING
    }, {
        tableName: 'Classes',
        timestamps: false
    });
};
