const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Mission', {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        description: DataTypes.TEXT,
        status: {
            type: DataTypes.TEXT,
            validate: {
                isIn: { args: [['quest', 'penality', 'exo', 'defi']], msg: 'Le statut doit être quest, penality, exo ou defi.' }
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Les points sont obligatoires.' },
                isInt: { msg: 'Les points doivent être un entier.' }
            }
        }
    }, {
        tableName: 'Missions',
        timestamps: false
    });
};
