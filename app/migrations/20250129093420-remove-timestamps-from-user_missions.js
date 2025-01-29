'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_missions', 'created_at');
    await queryInterface.removeColumn('user_missions', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_missions', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
    await queryInterface.addColumn('user_missions', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
  }
};
