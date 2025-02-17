'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('events', 'id_missions');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'id_missions', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'missions',
        key: 'id'
      }
    });
  }
};
