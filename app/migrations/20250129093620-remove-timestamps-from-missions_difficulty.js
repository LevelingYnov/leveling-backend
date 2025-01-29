'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('missions_difficulty', 'created_at');
    await queryInterface.removeColumn('missions_difficulty', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('missions_difficulty', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
    await queryInterface.addColumn('missions_difficulty', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    });
  }
};
