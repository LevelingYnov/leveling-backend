const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Defi', {
        code_user: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le code utilisateur est obligatoire.' }
            }
        },
        code_user2: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le code du deuxième utilisateur est obligatoire.' }
            }
        },
        winner: DataTypes.INTEGER,
        fk_defi_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La relation défi-utilisateur est obligatoire.' }
            }
        }
    }, {
        tableName: 'Defi',
        timestamps: false
    });
};
