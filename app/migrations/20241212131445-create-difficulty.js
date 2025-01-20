'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('difficulties', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: {
                    msg: 'Le nom de la difficulté doit être unique.',
                },
                validate: {
                    notNull: { msg: 'Le nom est obligatoire.' },
                    notEmpty: { msg: 'Le nom ne peut pas être vide.' },
                },
            },
            multiplicator: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Le multiplicateur est obligatoire.' },
                    isInt: { msg: 'Le multiplicateur doit être un entier.' },
                    min: { args: [1], msg: 'Le multiplicateur doit être supérieur ou égal à 1.' },
                },
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
        await queryInterface.dropTable('difficulties');
    }
};