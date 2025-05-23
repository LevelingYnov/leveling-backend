'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('defis', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            code_user: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: true,
                    notEmpty: true,
                },
            },
            code_user2: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: true,
                    notEmpty: true,
                },
            },
            winner: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    isInt: true,
                    min: 1,
                    max: 2,
                    isIn: [[1, 2]],
                },
            },
            fk_defi_users: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Table 'users'
                    key: 'id', // Clé primaire de la table 'users'
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
        await queryInterface.dropTable('defis');
    }
};