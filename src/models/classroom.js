'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClassRoom = sequelize.define('ClassRoom', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    classname:{
      type: DataTypes.STRING
    },
    isActive:{
      type:DataTypes.BOOLEAN
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
    tableName:'classrooms',
    defaultScope: {
      where: {
        isActive: true
      }
    }
  });

  ClassRoom.associate = function(models) {
    ClassRoom.hasMany(models.Student,{
      foreignKey:'classId',
      as:'class'
    })
  };
  
  return ClassRoom;
};