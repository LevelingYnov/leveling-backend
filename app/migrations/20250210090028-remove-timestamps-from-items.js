'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('items', 'created_at');
    await queryInterface.removeColumn('items', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('items', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
    await queryInterface.addColumn('items', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
  }
};
