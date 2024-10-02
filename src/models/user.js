'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Account);
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    state: DataTypes.ENUM('ACTIVE', 'LOCKED')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
