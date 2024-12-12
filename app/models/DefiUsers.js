const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('DefiUsers', {
        fk_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_user2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le deuxième utilisateur est obligatoire.' }
            }
        },
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        }
    }, {
        tableName: 'Defi_Users',
        timestamps: false
    });
};
