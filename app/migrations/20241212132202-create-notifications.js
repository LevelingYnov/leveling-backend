'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Notifications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Nom de la table Users
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            event_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Events', // Nom de la table Events
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            texte: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            notification_type: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: 'MISSION',
                validate: {
                    isIn: [['MISSION', 'REMINDER', 'SYSTEM', 'EVENT']]
                }
            },
            is_read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Notifications');
    }
};
