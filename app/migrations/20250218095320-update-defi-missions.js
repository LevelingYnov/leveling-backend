'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('defis', 'fk_mission1');
    await queryInterface.removeColumn('defis', 'fk_mission2');

    await queryInterface.addColumn('defis', 'fk_mission', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'missions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('defis', 'fk_mission');

    await queryInterface.addColumn('defis', 'fk_mission1', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.addColumn('defis', 'fk_mission2', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};