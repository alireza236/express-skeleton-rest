'use strict';
module.exports = (sequelize, DataTypes) => {
  const Telephone = sequelize.define('Telephone', {
    studentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING 
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName:'telephones',
    defaultScope:{
      where:{
        isActive: true
      }
    }
  });
  Telephone.associate = function(models) {
    Telephone.belongsTo(models.Student,{
      foreignKey:'studentId',
      as:'phoneStudent'
    })
  };
  return Telephone;
};