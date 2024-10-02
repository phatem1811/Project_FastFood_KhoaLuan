'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Bill);
    }
  }
  Customer.init({}, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};
