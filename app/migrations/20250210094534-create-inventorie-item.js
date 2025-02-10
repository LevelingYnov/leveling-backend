module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('inventorie_items', {
          fk_inventory: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'inventories',
                  key: 'id'
              },
              onDelete: 'CASCADE'
          },
          fk_item: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'items',
                  key: 'id'
              },
              onDelete: 'CASCADE'
          }
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('inventorie_items');
  }
};