'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('defi_users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            fk_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Table 'users'
                    key: 'id', // Clé primaire de la table 'users'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            fk_user2: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Table 'users'
                    key: 'id', // Clé primaire de la table 'users'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            fk_missions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'missions', // Table 'missions'
                    key: 'id', // Clé primaire de la table 'missions'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('defi_users');
    }
};