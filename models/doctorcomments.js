"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class doctorComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      doctorComments.belongsTo(models.users, {
        as: "commentUser",
        foreignKey: "userId",
      });
    }
  }
  doctorComments.init(
    {
      comment: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      Rate: DataTypes.INTEGER,
      likeUser: DataTypes.ARRAY(DataTypes.INTEGER),
      like: DataTypes.INTEGER,
      disLike: DataTypes.ARRAY(DataTypes.INTEGER),
      disLikeUser: DataTypes.ARRAY(DataTypes.INTEGER),
      disLike: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "doctorComments",
    }
  );
  return doctorComments;
};
