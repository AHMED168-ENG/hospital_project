const { validationResult } = require("express-validator");
const {
  removeImg,
  tryError,
  handel_validation_errors,
  Rename_uploade_img,
  returnWithMessage,
  removeImgFiled,
  Rename_uploade_img_multiFild,
} = require("../../../../Helper/helper");
const db = require("../../../../models");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../../../emails/sendEmails");
const { Op } = require("sequelize");

/*------------------- start login --------------------------------*/
const signIn_controller = async (req, res, next) => {
  try {
    res.render("frontEnd/auth/doctor/signIn", {
      title: "login doctor",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------- end login --------------------------------*/

/*----------------------------------- start signUp controller -----------------------------*/
const signUp_controller_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImgFiled([req.files.Graduation, req.files.birthImage]);
      handel_validation_errors(req, res, errors, "signUp");
      return;
    }
    var files = Rename_uploade_img_multiFild([
      req.files.Graduation,
      req.files.birthImage,
    ]);
    var doctor_data = req.body;
    var hashPassword = bcrypt.hashSync(doctor_data.password, 10);
    doctor_data.password = hashPassword;
    doctor_data.birthImage = files.birthImage;
    doctor_data.imageGraduate = files.Graduation;
    doctor_data.userId = req.cookies.User.id;
    await db.users.update(
      { isDoctor: true },
      {
        where: {
          id: req.cookies.User.id,
        },
      }
    );
    await db.doctors.create(doctor_data).then((result) => {
      returnWithMessage(
        req,
        res,
        "signUp",
        "You have been successfully registered on the site now, but you will not be activated until we can check the data that you have sent to us",
        "success"
      );
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------------------- end signUp controller ------------------------------*/
/*------------------- start login --------------------------------*/
const signUp_controller = async (req, res, next) => {
  try {
    res.render("frontEnd/auth/doctor/signUp", {
      title: "signUp pationt",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------- end login --------------------------------*/

/*----------------------------------- start signIn controller post ------------------------------*/
const signIn_controller_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "signIn");
      return;
    }
    var doctorData = req.body;
    var doctor = await db.doctors.findOne({
      where: {
        email: {
          [Op.eq]: doctorData.email,
        },
        userId: req.cookies.User.id,
      },
    });
    if (doctor) {
      var password = bcrypt.compareSync(doctorData.password, doctor.password);
      if (!password) {
        returnWithMessage(req, res, "signIn", "wrong password", "danger");
      } else {
        if (!doctor.isActive) {
          returnWithMessage(
            req,
            res,
            "signIn",
            "This account is not activated, check your email to activate",
            "danger"
          );
        } else {
          var expire = !doctorData.rememberMe ? { maxAge: 86400000 } : {};
          var message = doctorData.rememberMe
            ? "You are logged in successfully"
            : "You are logged in successfully " +
              "You will be automatically logged out one day after logging in";
          res.cookie("Doctor", doctor, expire);
          returnWithMessage(req, res, "/home", message, "success");
        }
      }
    } else {
      returnWithMessage(
        req,
        res,
        "signIn",
        "this email not have account",
        "danger"
      );
    }
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------------------- end signIn controller post ------------------------------*/

/*----------------------------------- start active user page ------------------------------*/
const activeUserPage = async (req, res, next) => {
  try {
    await db.users.update(
      {
        active: true,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    returnWithMessage(
      req,
      res,
      "/pationt/signIn",
      "You have been activated as a user, Login now",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------------------- end active user page ------------------------------*/

/*-----------------------------------  ------------------------------*/
const signOut = async (req, res, next) => {
  try {
    res.clearCookie("Doctor");
    res.redirect("/doctor/signIn");
  } catch (error) {}
};
/*----------------------------------- start sign Out ------------------------------*/

module.exports = {
  signUp_controller,
  signIn_controller,
  signUp_controller_post,
  activeUserPage,
  signOut,
  signIn_controller_post,
};
