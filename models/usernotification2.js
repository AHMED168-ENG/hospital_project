"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userNotification2 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userNotification2.belongsTo(models.users, {
        as: "Notification2User",
        foreignKey: "from",
      });
    }
  }
  userNotification2.init(
    {
      from: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      typeOfNotification: DataTypes.STRING,
      text: DataTypes.STRING,
      isSeen: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "userNotification2",
    }
  );
  return userNotification2;
};
