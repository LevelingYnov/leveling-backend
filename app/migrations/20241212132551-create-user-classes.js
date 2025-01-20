'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_classes', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            fk_users: {
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
            fk_classes: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'classes',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                validate: {
                    notNull: { msg: 'La classe est obligatoire.' }
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
        await queryInterface.dropTable('user_classes');
    }
};