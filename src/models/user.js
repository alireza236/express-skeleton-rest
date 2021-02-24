'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email :{
      type: DataTypes.STRING(64),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    resetPasswordToken: {
      type:DataTypes.STRING
    },
    resetPasswordExpires: {
      type:DataTypes.DATE
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
    tableName: 'users',
      defaultScope: {
        where: {
          isActive: true
        }
      }
  });
  
  return User;
};