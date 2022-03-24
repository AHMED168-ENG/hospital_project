const { tryError } = require("../../../Helper/helper");

const DoctorAuthonticat = async (req, res, next) => {
  try {
    if (!req.cookies.Doctor) {
      res.redirect("/doctor/signIn");
    } else {
      next();
    }
  } catch (error) {
    tryError(res);
  }
};

module.exports = {
  DoctorAuthonticat,
};
