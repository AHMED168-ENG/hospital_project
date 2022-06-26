const bcrypt = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        fName: "ahmed",
        lName: "zaky",
        email: "ahmed@ahmed.com",
        age: 22,
        password: bcrypt.hashSync(
          "01024756410ahmed",
          parseInt(process.env.BCRYPT_SEKRET_KEY)
        ),
        addres: "domyate",
        roles: ["U", "S"],
        number: "1024756410",
        active: true,
        lang: "en",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
