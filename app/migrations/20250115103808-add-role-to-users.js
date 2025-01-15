'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'role', {
            type: Sequelize.ENUM('User', 'Admin', 'SuperAdmin'),
            allowNull: false,
            defaultValue: 'User'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'role');
    }
};
