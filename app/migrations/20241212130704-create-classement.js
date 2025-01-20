'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('classements', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                },
            },
            fk_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Nom de la table User
                    key: 'id', // Clé primaire de la table User
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE', // Supprimer un classement si l'utilisateur est supprimé
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
        await queryInterface.dropTable('classements');
    }
};