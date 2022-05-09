const { check } = require("express-validator");

const pharmacyOrderValidate = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage("Enter the your name")
      .isString()
      .withMessage("This field receives text")
      .isLength({ max: 20, min: 5 })
      .withMessage(
        "your name must not exceed 20 characters and must not be less than 5 characters"
      ),
    check("phone").notEmpty().withMessage("Enter the phone"),
    check("addres").notEmpty().withMessage("Enter Addres"),

    check("image")
      .custom(async (value, { req }) => {
        if (req.files.length == 0) {
          throw new Error("");
        } else {
          return true;
        }
      })
      .withMessage(`enter your medicine photo`)
      .custom(async (value, { req }) => {
        if (!req.file) return true;
        var arrayExtention = ["jpg", "png", "jpeg", "gif", "svg"];
        var originalname = req.file.originalname.split(".");
        var imgExtension = originalname[originalname.length - 1].toLowerCase();
        if (!arrayExtention.includes(imgExtension)) {
          removeImg(req, req.file.filename);
          throw new Error("");
        }
      })
      .withMessage(`The image extension must be jpg, jpeg, png, gif, svg`)
      .custom(async (value, { req }) => {
        if (!req.file) return true;
        if (req.file.size > 200000) {
          throw new Error("");
        }
      })
      .withMessage("The image must not be more than 200000 kb"),
  ];
};
module.exports = {
  pharmacyOrderValidate,
};
