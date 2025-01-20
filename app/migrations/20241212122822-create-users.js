'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            registration_date: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            poids: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            taille: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            experience: {
                type: Sequelize.ENUM('BEGINNER', 'INTERMEDIATE', 'EXPERT'),
                allowNull: true,
            },
            points: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            abonnement: {
                type: Sequelize.ENUM('FREE', 'PREMIUM'),
                allowNull: false,
                defaultValue: 'FREE',
            },
            role: {
                type: Sequelize.ENUM('User', 'Admin', 'SuperAdmin'),
                allowNull: false,
                defaultValue: 'User',
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
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};