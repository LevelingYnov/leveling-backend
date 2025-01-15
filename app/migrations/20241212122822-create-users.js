'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            registration_date: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            poids: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            taille: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            experience: {
                type: Sequelize.STRING,
                allowNull: true,
                validate: {
                    isIn: [['BEGINNER', 'INTERMEDIATE', 'EXPERT']]
                }
            },
            points: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            abonnement: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: 'FREE',
                validate: {
                    isIn: [['FREE', 'PREMIUM']]
                }
            },
            role: {
                type: Sequelize.ENUM('User', 'Admin', 'SuperAdmin'),
                allowNull: false,
                defaultValue: 'User'
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
        await queryInterface.dropTable('Users');
    }
};
