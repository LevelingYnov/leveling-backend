const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Inventory', {
        fk_items: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'item est obligatoire.' }
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
        tableName: 'Inventories',
        timestamps: false
    });
};
