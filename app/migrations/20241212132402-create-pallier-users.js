'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('pallier_users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            fk_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                validate: {
                    notNull: { msg: 'L\'utilisateur est obligatoire.' }
                }
            },
            fk_pallier: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'palliers',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                validate: {
                    notNull: { msg: 'Le pallier est obligatoire.' }
                }
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
        await queryInterface.dropTable('pallier_users');
    }
};