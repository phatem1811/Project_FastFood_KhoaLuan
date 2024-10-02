'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      Bill.belongsTo(models.Voucher);
      Bill.hasMany(models.LineItem);
    }
  }
  Bill.init({
    productPrice: DataTypes.FLOAT,
    ship: DataTypes.FLOAT,
    totalPrice: DataTypes.FLOAT,
    state: DataTypes.ENUM('UNPAID', 'PAID', 'CANCEL', 'SHIPPING', 'DELIVERED', 'RECEIVED'),
    addressShipment: DataTypes.STRING,
    phoneShipment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};
