'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'resetPasswordToken', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'resetPasswordToken');
    await queryInterface.removeColumn('users', 'resetPasswordExpires');
  }
};
