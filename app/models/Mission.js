const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Mission', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom est obligatoire.' }
            }
        },
        description: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['quest', 'penality', 'exo', 'defi']], msg: 'Le statut doit �tre quest, penality, exo ou defi.' }
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Les points sont obligatoires.' },
                isInt: { msg: 'Les points doivent �tre un entier.' }
            }
        }
    }, {
        tableName: 'Missions',
        timestamps: false
    });
};
