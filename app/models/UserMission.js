const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserMission', {
        fk_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'L\'utilisateur est obligatoire.' }
            }
        },
        fk_missions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'La mission est obligatoire.' }
            }
        },
        starttime: DataTypes.DATE,
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['PASSED', 'FAILED']], msg: 'Le statut doit �tre PASSED ou FAILED.' }
            }
        }
    }, {
        tableName: 'User_Missions',
        timestamps: false
    });
};
