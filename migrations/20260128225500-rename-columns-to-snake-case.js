'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Rename columns in Visitors table
        await queryInterface.renameColumn('Visitors', 'visitCount', 'visit_count');
        await queryInterface.renameColumn('Visitors', 'createdAt', 'created_at');
        await queryInterface.renameColumn('Visitors', 'updatedAt', 'updated_at');

        // Rename columns in Users table
        await queryInterface.renameColumn('Users', 'createdAt', 'created_at');
        await queryInterface.renameColumn('Users', 'updatedAt', 'updated_at');
    },

    async down(queryInterface, Sequelize) {
        // Revert names in Visitors table
        await queryInterface.renameColumn('Visitors', 'visit_count', 'visitCount');
        await queryInterface.renameColumn('Visitors', 'created_at', 'createdAt');
        await queryInterface.renameColumn('Visitors', 'updated_at', 'updatedAt');

        // Revert names in Users table
        await queryInterface.renameColumn('Users', 'created_at', 'createdAt');
        await queryInterface.renameColumn('Users', 'updated_at', 'updatedAt');
    }
};
