'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('missions', 'limit_time', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('missions', 'minimum_time', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('missions', 'limit_time');
    await queryInterface.removeColumn('missions', 'minimum_time');
  }
};
