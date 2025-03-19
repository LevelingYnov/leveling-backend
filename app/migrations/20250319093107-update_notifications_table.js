'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimer les colonnes created_at et updated_at de la table events
    await queryInterface.removeColumn('notifications', 'created_at');
    await queryInterface.removeColumn('notifications', 'updated_at');
  },

  down: async (queryInterface, Sequelize) => {
    // Si la migration est annulée, on les réajoute
    await queryInterface.addColumn('notifications', 'created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.addColumn('notifications', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
  }
};