'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LineItem extends Model {
    static associate(models) {
      LineItem.belongsTo(models.Bill);
      LineItem.belongsTo(models.Product);
    }
  }
  LineItem.init({
    quantity: DataTypes.INTEGER,
    subtotal: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'LineItem',
  });
  return LineItem;
};
