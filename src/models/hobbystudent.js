'use strict';
module.exports = (sequelize, DataTypes) => {
  const HobbyStudent = sequelize.define('HobbyStudent', {
    studentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primariKey: true,
    },
    hobbyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primariKey: true,
      allowNull: false,
    },
    createdAt: {
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: DataTypes.NOW,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'hobbystudents'
  });
  HobbyStudent.associate = function(models) {
    HobbyStudent.belongsTo(models.Student,{
      foreignKey:'studentId',
    });
    
    HobbyStudent.belongsTo(models.Hobby,{
      foreignKey:'hobbyId',
    });
  };
  return HobbyStudent;
};