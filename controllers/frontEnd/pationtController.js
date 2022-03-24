const { validationResult } = require("express-validator");
const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
  formateDate,
} = require("../../Helper/helper");
const db = require("../../models");
const bcrypt = require("bcrypt");

/*------------------------------ start home Page ------------------------*/
const pationt_dashpored = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/pationt/userProfile_dashpored", {
      title: "userProfile_setings",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      URL: req.url,
      doctor: req.cookies.Doctor,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------------------ start home Page ------------------------*/
/*------------------------------ start home Page ------------------------*/
const pationtfavoritDoctors = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/pationt/favoritDoctors", {
      title: "favoritDoctors",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      URL: req.url,
      doctor: req.cookies.Doctor,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------------------ start home Page ------------------------*/
/*------------------------------ start home Page ------------------------*/
const pationt_setings = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/pationt/userProfile_seting", {
      title: "userProfile setings",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      URL: req.url,
      doctor: req.cookies.Doctor,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res, errors);
  }
};
/*------------------------------ start home Page ------------------------*/
/*------------------------------ start home Page ------------------------*/
const pationt_setings_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(req, res, errors, "pationt_setings");
      return;
    }
    var userData = req.body;
    var image = Rename_uploade_img(req);
    if (image) {
      removeImg(req, "patients/", userData.OldpationtImage);
    } else {
      image = userData.OldpationtImage;
    }
    userData.image = image;
    userData.Date_brith = userData.Date_brith ? userData.Date_brith : null;
    userData.age = userData.age ? userData.age : null;
    await db.users.update(userData, {
      where: {
        id: req.cookies.User.id,
      },
    });
    res.clearCookie("User");
    res.clearCookie("Doctor");
    returnWithMessage(
      req,
      res,
      "signIn",
      "Sign In again Becouse We Update Websit",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start home Page ------------------------*/
/*------------------------------ start home Page ------------------------*/
const resetPassword = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/pationt/resetPassword", {
      title: "resetPassword",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctor,
      validationError: req.flash("validationError")[0],
      URL: req.url,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start home Page ------------------------*/
/*------------------------------ start home Page ------------------------*/
const resetPassword_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "resetPassword");
      return;
    }
    var passwordData = req.body;
    var hashPassword = bcrypt.hashSync(passwordData.password, 10);
    await db.users.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: passwordData.id,
        },
      }
    );
    res.clearCookie("User");
    res.clearCookie("Doctor");
    returnWithMessage(
      req,
      res,
      "signIn",
      "Sign In again Becouse We Update Websit",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start home Page ------------------------*/

module.exports = {
  pationt_dashpored,
  pationt_setings,
  pationtfavoritDoctors,
  pationt_setings_post,
  resetPassword,
  resetPassword_post,
};
