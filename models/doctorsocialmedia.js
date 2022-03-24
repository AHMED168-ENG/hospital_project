"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class doctorSocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  doctorSocialMedia.init(
    {
      doctorId: DataTypes.INTEGER,
      instegramURL: DataTypes.STRING,
      facebook: DataTypes.STRING,
      pinterestURL: DataTypes.STRING,
      linkedinURL: DataTypes.STRING,
      youtubeURL: DataTypes.STRING,
      twitter: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "doctorSocialMedia",
    }
  );
  return doctorSocialMedia;
};
