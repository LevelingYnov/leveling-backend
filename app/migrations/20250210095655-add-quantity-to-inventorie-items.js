'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('inventorie_items', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('inventorie_items', 'quantity');
  }
};