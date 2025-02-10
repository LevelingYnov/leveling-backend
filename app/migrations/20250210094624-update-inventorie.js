'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('inventories', 'fk_items');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('inventories', 'fk_items', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          notNull: { msg: 'L\'item est obligatoire.' }
      },
      references: {
          model: 'items',
          key: 'id'
      }
    });
  }
};