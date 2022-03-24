"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctorComments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      Rate: {
        type: Sequelize.INTEGER,
      },
      likeUser: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      like: {
        type: Sequelize.INTEGER,
      },
      disLike: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      disLike: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("doctorComments");
  },
};
