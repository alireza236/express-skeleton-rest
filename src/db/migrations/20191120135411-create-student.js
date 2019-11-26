'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('students', {
      id: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname:{
        type: Sequelize.STRING
      },
      address:{
        type: Sequelize.STRING
      },
      email:{
        type: Sequelize.STRING
      },
      classId: {
        type: Sequelize.UUID
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    return queryInterface.dropTable('students');
  }
};