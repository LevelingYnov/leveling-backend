'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajouter les colonnes start_time et end_time à la table Event
    await queryInterface.addColumn('events', 'start_time', {
      type: Sequelize.DATE,
      allowNull: false, // ou true selon ton besoin
    });

    await queryInterface.addColumn('events', 'end_time', {
      type: Sequelize.DATE,
      allowNull: false, // ou true selon ton besoin
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revenir en arrière si la migration échoue ou est annulée
    await queryInterface.removeColumn('events', 'start_time');
    await queryInterface.removeColumn('events', 'end_time');
  }
};