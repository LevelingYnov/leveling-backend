'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('defis', 'fk_defi_users'); // Supprime l'ancienne relation

    await queryInterface.changeColumn('defis', 'code_user2', {
      type: Sequelize.STRING,
      allowNull: true // On permet de créer un défi avec un seul utilisateur au départ
    });

    await queryInterface.addColumn('defis', 'fk_mission1', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'missions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('defis', 'fk_mission2', {
      type: Sequelize.INTEGER,
      allowNull: true, // On met `NULL` au départ, car la deuxième mission est créée plus tard
      references: {
        model: 'missions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('defis', 'status', {
      type: Sequelize.ENUM('PENDING', 'ACTIVE', 'FINISHED'),
      defaultValue: 'PENDING' // Le défi commence en attente
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('defis', 'fk_defi_users', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('defis', 'code_user2', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.removeColumn('defis', 'fk_mission1');
    await queryInterface.removeColumn('defis', 'fk_mission2');
    await queryInterface.removeColumn('defis', 'status');
  }
};
