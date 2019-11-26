'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING(64)
    },
    lastname:{
      type: DataTypes.STRING(64)
    },
    address:{
      type: DataTypes.TEXT
    },
    email:{
      type: DataTypes.STRING(15)
    },
    classId:{
      type: DataTypes.UUID
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
    tableName: 'students',
    defaultScope: {
      where: {
        isActive: true
      }
    }
  });
  Student.associate = function(models) {
    Student.hasOne(models.Telephone,{
      foreignKey:'studentId',
      as:'telephone'
    });
    Student.belongsTo(models.ClassRoom,{
      foreignKey:'classId',
      as:'class'
    });

    Student.belongsToMany(models.Hobby,{
      through:'HobbyStudent',
      foreignKey:'studentId',
      otherKey:'hobbyId',
      as:'hobbys'
    })

  };
  return Student;
};