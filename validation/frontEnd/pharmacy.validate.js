const { check } = require("express-validator");

const pharmacy_validate = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage("Enter the first name")
      .isString()
      .withMessage("This field receives text")
      .isLength({ max: 20, min: 10 })
      .withMessage(
        "name must not exceed 20 characters and must not be less than 10 characters"
      ),
    check("phone").notEmpty().withMessage("Enter the phone"),
    check("province").notEmpty().withMessage("Enter the province"),
    check("village").notEmpty().withMessage("Enter village"),

    check("image")
      .custom(async (value, { req }) => {
        if (
          req.files.length == 0 &&
          req.url != `/editLabs/${req.params.id}` &&
          req.url != `/editPharmasy/${req.params.id}`
        ) {
          throw new Error("");
        }
        return true;
      })
      .withMessage(`you should enter labe image`)
      .custom(async (value, { req }) => {
        if (req.files.length == 0) return true;
        req.files.forEach((element) => {
          if (element.size > 200000000) {
            throw new Error("");
          }
        });
        return true;
      })
      .withMessage("الصوره يجب الا تزيد عن 200000000 kb")
      .custom(async (value, { req }) => {
        if (req.files.length == 0) return true;
        req.files.forEach((element) => {
          var arrayExtention = ["jpg", "png", "jpeg", "gif", "svg"];
          var originalname = element.originalname.split(".");
          var imgExtension =
            originalname[originalname.length - 1].toLowerCase();
          if (!arrayExtention.includes(imgExtension)) {
            throw new Error("");
          }
        });
      })
      .withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`),
  ];
};
module.exports = {
  pharmacy_validate,
};
