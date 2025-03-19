'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Ajoute la colonne created_at si elle n'existe pas déjà
        const tableDesc = await queryInterface.describeTable('notifications');
        if (!tableDesc.created_at) {
            await queryInterface.addColumn('notifications', 'created_at', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Supprime la colonne created_at en cas de rollback
        await queryInterface.removeColumn('notifications', 'created_at');
    }
};
