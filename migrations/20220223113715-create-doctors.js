"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fName: {
        type: Sequelize.STRING,
      },
      lName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.SMALLINT,
      },
      aboutMe: {
        type: Sequelize.TEXT,
      },
      specialist: {
        type: Sequelize.INTEGER,
      },
      Addres: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      country: {
        type: Sequelize.STRING,
      },
      isFree: {
        type: Sequelize.BOOLEAN,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      service: {
        type: Sequelize.STRING,
      },
      degree: {
        type: Sequelize.STRING,
      },
      collega: {
        type: Sequelize.STRING,
      },
      Completion: {
        type: Sequelize.STRING,
      },
      hospitalName: {
        type: Sequelize.STRING,
      },
      from: {
        type: Sequelize.STRING,
      },
      to: {
        type: Sequelize.STRING,
      },
      awardes: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      doctorImage: {
        type: Sequelize.STRING,
      },
      imageGraduate: {
        type: Sequelize.STRING,
      },
      birthImage: {
        type: Sequelize.STRING,
      },
      awardesDate: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      userRate: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    await queryInterface.dropTable("doctors");
  },
};
