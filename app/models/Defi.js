const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Defi', {
        code_user: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le code utilisateur est obligatoire.' }
            }
        },
        code_user2: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le code du deuxi�me utilisateur est obligatoire.' }
            }
        },
        winner: DataTypes.INTEGER,
        fk_defi_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La relation d�fi-utilisateur est obligatoire.' }
            }
        }
    }, {
        tableName: 'Defi',
        timestamps: false
    });
};
