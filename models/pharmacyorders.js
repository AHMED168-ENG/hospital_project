"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pharmacyOrders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pharmacyOrders.init(
    {
      name: DataTypes.STRING,
      addres: DataTypes.STRING,
      image: DataTypes.STRING,
      phone: DataTypes.STRING,
      isSeen: DataTypes.BOOLEAN,
      from: DataTypes.INTEGER,
      accept: DataTypes.BOOLEAN,
      to: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "pharmacyOrders",
    }
  );
  return pharmacyOrders;
};
