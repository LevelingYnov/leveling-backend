'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('inventories', 'created_at');
    await queryInterface.removeColumn('inventories', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('inventories', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
    await queryInterface.addColumn('inventories', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
  }
};
