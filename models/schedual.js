"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class schedual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  schedual.init(
    {
      Sunday: DataTypes.ARRAY(DataTypes.STRING),
      Monday: DataTypes.ARRAY(DataTypes.STRING),
      Tuesday: DataTypes.ARRAY(DataTypes.STRING),
      Wednesday: DataTypes.ARRAY(DataTypes.STRING),
      Thursday: DataTypes.ARRAY(DataTypes.STRING),
      Friday: DataTypes.ARRAY(DataTypes.STRING),
      Saturday: DataTypes.ARRAY(DataTypes.STRING),
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "schedual",
    }
  );
  return schedual;
};
