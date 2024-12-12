'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Defi', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            code_user: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            code_user2: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            winner: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            fk_defi_users: {
                type: Sequelize.INTEGER,
                allowNull: false
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
        await queryInterface.dropTable('Defi');
    }
};
