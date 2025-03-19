'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('items', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('missions', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('items', 'image');
    await queryInterface.removeColumn('missions', 'image');
  }
};