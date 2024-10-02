'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsToMany(models.Product, { through: 'EventProducts' });
    }
  }
  Event.init({
    name: DataTypes.STRING,
    discountPercent: DataTypes.FLOAT,
    prodDate: DataTypes.DATE,
    expDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
