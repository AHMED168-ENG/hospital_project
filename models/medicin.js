"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class medicin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medicin.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      province: DataTypes.STRING,
      village: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "medicin",
    }
  );
  return medicin;
};
