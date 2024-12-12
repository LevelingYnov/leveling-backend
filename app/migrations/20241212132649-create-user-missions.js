'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('User_Missions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fk_users: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Nom de la table Users
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            fk_missions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Missions', // Nom de la table Missions
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            starttime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            status: {
                type: Sequelize.TEXT,
                allowNull: true,
                validate: {
                    isIn: [['PASSED', 'FAILED']]
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('User_Missions');
    }
};
