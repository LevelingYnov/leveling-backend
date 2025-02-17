'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('events', 'start_time', {
      type: Sequelize.TIME,
      allowNull: false
    });

    await queryInterface.changeColumn('events', 'end_time', {
      type: Sequelize.TIME,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('events', 'start_time', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('events', 'end_time', {
      type: Sequelize.DATE,
      allowNull: false
    });
  }
};
