'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HobbyStudents', {
      studentId: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      hobbyId:{
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: Sequelize.NOW,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HobbyStudents');
  }
};