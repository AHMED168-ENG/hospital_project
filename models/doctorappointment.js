"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class doctorAppointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      doctorAppointment.belongsTo(models.users, {
        as: "ApointmentPationt",
        foreignKey: "pationtId",
      });
    }
  }
  doctorAppointment.init(
    {
      doctorId: DataTypes.INTEGER,
      pationtId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      time: DataTypes.STRING,
      accept: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "doctorAppointment",
    }
  );
  return doctorAppointment;
};
