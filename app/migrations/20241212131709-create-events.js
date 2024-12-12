'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Events', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_missions: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            event_type: {
                type: Sequelize.TEXT,
                allowNull: true,
                validate: {
                    isIn: [['MISSION_STARTED', 'MISSION_COMPLETED', 'REMINDER']]
                }
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Events');
    }
};
