'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('defis', 'code_user');
    await queryInterface.removeColumn('defis', 'code_user2');

    await queryInterface.addColumn('defis', 'code_defi', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    await queryInterface.addColumn('defis', 'fk_user1', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('defis', 'fk_user2', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('defis', 'code_defi');
    await queryInterface.removeColumn('defis', 'fk_user1');
    await queryInterface.removeColumn('defis', 'fk_user2');

    await queryInterface.addColumn('defis', 'code_user', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('defis', 'code_user2', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};