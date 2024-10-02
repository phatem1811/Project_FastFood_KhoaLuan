'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasMany(models.Bill);
    }
  }
  Voucher.init({
    discount: DataTypes.FLOAT,
    expDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};
