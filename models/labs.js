"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class labs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  labs.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      province: DataTypes.STRING,
      village: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "labs",
    }
  );
  return labs;
};
