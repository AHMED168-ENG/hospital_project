"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class doctors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      doctors.belongsTo(models.specialist, {
        as: "DoctorSpecialist",
        foreignKey: "specialist",
      });
      doctors.hasMany(models.doctorComments, {
        as: "doctorComment",
        foreignKey: "doctorId",
      });
      doctors.hasOne(models.clinic, {
        as: "Doctorclinic",
        foreignKey: "doctorId",
      });
      doctors.belongsTo(models.users, {
        as: "DoctorUser",
        foreignKey: "userId",
      });
    }
  }
  doctors.init(
    {
      fName: DataTypes.STRING,
      lName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.NUMBER,
      gender: DataTypes.SMALLINT,
      aboutMe: DataTypes.TEXT,
      specialist: DataTypes.INTEGER,
      Addres: DataTypes.STRING,
      city: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      country: DataTypes.STRING,
      isFree: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      service: DataTypes.STRING,
      degree: DataTypes.STRING,
      collega: DataTypes.STRING,
      Completion: DataTypes.STRING,
      hospitalName: DataTypes.STRING,
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      awardes: DataTypes.STRING,
      doctorImage: DataTypes.STRING,
      imageGraduate: DataTypes.STRING,
      birthImage: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      awardesDate: DataTypes.STRING,
      userRate: DataTypes.ARRAY(DataTypes.INTEGER),
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "doctors",
    }
  );
  return doctors;
};
