const { tryError } = require("../../../Helper/helper");

const DoctorNotAuthonticat = async (req, res, next) => {
  try {
    if (req.cookies.Doctor) {
      res.redirect("/home");
    } else {
      next();
    }
  } catch (error) {
    tryError(res);
  }
};

module.exports = {
  DoctorNotAuthonticat,
};
