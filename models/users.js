"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      fName: DataTypes.STRING,
      lName: DataTypes.STRING,
      age: DataTypes.INTEGER,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      addres: DataTypes.STRING,
      mobile: DataTypes.STRING,
      image: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      Date_brith: DataTypes.DATE,
      bloodType: DataTypes.STRING,
      isDoctor: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
