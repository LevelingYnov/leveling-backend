const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Class', {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        description: DataTypes.TEXT
    }, {
        tableName: 'Classes',
        timestamps: false
    });
};
