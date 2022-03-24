"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctorSocialMedia", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      instegramURL: {
        type: Sequelize.STRING,
      },
      pinterestURL: {
        type: Sequelize.STRING,
      },
      twitter: {
        type: Sequelize.STRING,
      },
      facebook: {
        type: Sequelize.STRING,
      },
      linkedinURL: {
        type: Sequelize.STRING,
      },
      youtubeURL: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("doctorSocialMedia");
  },
};
