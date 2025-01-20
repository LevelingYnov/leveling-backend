'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'L\'utilisateur est obligatoire.' }
                },
                references: {
                    model: 'users', // Assurez-vous que la table 'users' existe
                    key: 'id',
                },
                onDelete: 'CASCADE', // Supprimer les notifications liées à un utilisateur si l'utilisateur est supprimé
            },
            event_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'events', // Assurez-vous que la table 'events' existe
                    key: 'id',
                },
                onDelete: 'SET NULL', // Si l'événement est supprimé, on met à NULL l'event_id dans les notifications
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Le message est obligatoire.' }
                }
            },
            notification_type: {
                type: Sequelize.STRING,
                defaultValue: 'MISSION',
                validate: {
                    isIn: { args: [['MISSION', 'REMINDER', 'SYSTEM', 'EVENT']], msg: 'Le type de notification doit être valide.' }
                }
            },
            is_read: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('notifications');
    }
};