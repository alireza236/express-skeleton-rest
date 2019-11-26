'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hobby = sequelize.define('Hobby', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    hobbyname: {
      type:DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'hobbies',
    defaultScope: {
      where: {
        isActive: true
      }
    }
  });
  Hobby.associate = function(models) {
    Hobby.belongsToMany(models.Student,{
      through:'HobbyStudent',
      foreignKey:'hobbyId',
      otherKey:'studentId',
      as:'hobbys'
    })
  };
  return Hobby;
};