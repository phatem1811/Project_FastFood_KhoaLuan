'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category);
      Product.hasMany(models.LineItem);
    }
  }
  Product.init({
    name: DataTypes.STRING,
    picture: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    isSelling: DataTypes.BOOLEAN,
    isStock: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
