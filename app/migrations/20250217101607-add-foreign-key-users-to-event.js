'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajout de la colonne id_users pour lier un événement à un utilisateur
    await queryInterface.addColumn('events', 'id_users', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    });

    // Création de l'index unique pour garantir qu'un utilisateur ne puisse avoir qu'un événement de chaque type
    await queryInterface.addIndex('events', ['id_users', 'event_type'], {
      unique: true,
      name: 'unique_event_per_user_and_type'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Suppression de la colonne id_users
    await queryInterface.removeColumn('events', 'id_users');

    // Suppression de l'index unique
    await queryInterface.removeIndex('events', 'unique_event_per_user_and_type');
  }
};