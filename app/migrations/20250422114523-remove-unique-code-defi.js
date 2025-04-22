'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprime l'index unique 'code_defi'
    await queryInterface.removeIndex('defis', 'code_defi');
  },

  down: async (queryInterface, Sequelize) => {
    // Le recrée si rollback
    await queryInterface.addIndex('defis', ['code_defi'], {
      unique: true,
      name: 'code_defi',
    });
  }
};
