'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameTable('Users', 'users');
        await queryInterface.renameTable('Visitors', 'visitors');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.renameTable('users', 'Users');
        await queryInterface.renameTable('visitors', 'Visitors');
    }
};
