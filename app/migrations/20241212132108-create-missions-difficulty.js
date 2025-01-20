'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('missions_difficulty', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            fk_missions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'La mission est obligatoire.' }
                },
                references: {
                    model: 'missions', // Assurez-vous que la table 'missions' existe
                    key: 'id',
                },
                onDelete: 'CASCADE',  // Supprime les entrées associées si la mission est supprimée
            },
            fk_difficulty: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'La difficulté est obligatoire.' }
                },
                references: {
                    model: 'difficulties', // Assurez-vous que la table 'difficulties' existe
                    key: 'id',
                },
                onDelete: 'CASCADE',  // Supprime les entrées associées si la difficulté est supprimée
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('missions_difficulty');
    }
};