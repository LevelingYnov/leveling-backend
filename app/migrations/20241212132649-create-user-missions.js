'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_missions', {
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
                    model: 'users', // Table 'users'
                    key: 'id'
                },
                onDelete: 'CASCADE',
                validate: {
                    notNull: { msg: 'L\'utilisateur est obligatoire.' }
                }
            },
            fk_missions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'missions', // Table 'missions'
                    key: 'id'
                },
                onDelete: 'CASCADE',
                validate: {
                    notNull: { msg: 'La mission est obligatoire.' }
                }
            },
            starttime: {
                type: Sequelize.DATE,
                allowNull: true,
                validate: {
                    isDate: { msg: 'La date de début doit être une date valide.' }
                }
            },
            status: {
                type: Sequelize.STRING,
                allowNull: true,
                validate: {
                    isIn: {
                        args: [['PASSED', 'FAILED']],
                        msg: 'Le statut doit être PASSED ou FAILED.'
                    }
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
        await queryInterface.dropTable('user_missions');
    }
};