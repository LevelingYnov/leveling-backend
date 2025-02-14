'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      const [difficulty] = await queryInterface.sequelize.query(
          `SELECT id FROM difficulties WHERE name = 'Normal' LIMIT 1;`
      );

      let defaultDifficultyId = difficulty.length ? difficulty[0].id : null;

      if (!defaultDifficultyId) {
          await queryInterface.sequelize.query(
              `INSERT INTO difficulties (name, multiplicator, createdAt, updatedAt) 
               VALUES ('Normal', 3, NOW(), NOW());`
          );

          const [newDifficulty] = await queryInterface.sequelize.query(
              `SELECT id FROM difficulties WHERE name = 'Normal' LIMIT 1;`
          );

          defaultDifficultyId = newDifficulty[0].id;
      }

      // Ajouter la colonne avec la valeur par défaut
      await queryInterface.addColumn('user_missions', 'fk_difficulty', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: defaultDifficultyId,
          references: {
              model: 'difficulties',
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('user_missions', 'fk_difficulty');
  }
};