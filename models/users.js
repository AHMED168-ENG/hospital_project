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
      users.hasOne(models.doctors, {
        as: "userDoctorData",
        foreignKey: "userId",
      });
      users.hasMany(models.postComments, {
        as: "userPostsComment",
        foreignKey: "userId",
      });
      users.hasMany(models.userPosts, { as: "UserPosts", foreignKey: "from" });
      users.hasMany(models.userNotification, {
        foreignKey: "userId",
        as: "userNotification",
      });
      users.hasMany(models.usersMessage, {
        as: "userToMessage",
        foreignKey: "to",
      });
      users.hasMany(models.usersMessage, {
        as: "userFromMessage",
        foreignKey: "from",
      });
      users.hasMany(models.doctorAppointment, {
        as: "pationtApointment",
        foreignKey: "pationtId",
      });
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
      numberOfPosts: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "users",
      scopes: {
        active: {
          where: {
            active: true,
          },
        },
      },
    }
  );
  return users;
};
