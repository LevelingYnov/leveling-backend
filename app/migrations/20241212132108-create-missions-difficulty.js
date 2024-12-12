'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Missions_Difficulty', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            fk_difficulty: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Difficulty', // Nom de la table Difficulty
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        await queryInterface.dropTable('Missions_Difficulty');
    }
};
