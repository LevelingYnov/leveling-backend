'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addIndex('defis', ['code_defi'], {
          name: 'idx_code_defi',
          unique: false
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeIndex('defis', 'idx_code_defi');
  }
};

