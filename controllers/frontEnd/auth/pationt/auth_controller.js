const { validationResult } = require("express-validator");
const {
  removeImg,
  tryError,
  handel_validation_errors,
  Rename_uploade_img,
  returnWithMessage,
} = require("../../../../Helper/helper");
const db = require("../../../../models");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../../../emails/sendEmails");
const { Op } = require("sequelize");

/*------------------- start login --------------------------------*/
const signIn_controller = async (req, res, next) => {
  try {
    res.render("frontEnd/auth/pationt/signIn", {
      title: "login pationt",
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
      removeImg(req, "image/");
      handel_validation_errors(req, res, errors, "signUp");
      return;
    }
    var image = Rename_uploade_img(req);
    var user_data = req.body;
    var hashPassword = bcrypt.hashSync(user_data.password, 10);
    user_data.password = hashPassword;
    user_data.image = image ? image : "avatar.png--";
    user_data.active = false;
    await db.users.create(user_data).then((result) => {
      sendEmail(
        user_data.email,
        result.id,
        user_data.fName,
        user_data.lName,
        "تم اضافه حساب خاص بك كمستخدم قم بالتفعيل من هنا",
        "pationt/activeUserPage"
      );
      returnWithMessage(
        req,
        res,
        "signUp",
        "You have been registered as a new user to interact on the site. A confirmation message has been sent to the site on the registration email",
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
    res.render("frontEnd/auth/pationt/signUp", {
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
    var userData = req.body;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "signIn");
      return;
    }
    var user = await db.users.findOne({
      where: {
        email: {
          [Op.eq]: userData.email,
        },
      },
    });
    if (user) {
      var password = bcrypt.compareSync(userData.password, user.password);
      if (!password) {
        returnWithMessage(
          req,
          res,
          "signIn",
          "الرقم السري اللذي ادخلته خاطا",
          "danger"
        );
      } else {
        if (!user.active) {
          returnWithMessage(
            req,
            res,
            "signIn",
            "This account is not activated, check your email to activate",
            "danger"
          );
        } else {
          var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};
          var message = userData.rememberMe
            ? "You are logged in successfully"
            : "You are logged in successfully " +
              "You will be automatically logged out one day after logging in";
          res.cookie("User", user, expire);
          returnWithMessage(req, res, "/home", message, "success");
        }
      }
    } else {
      returnWithMessage(
        req,
        res,
        "signIn",
        "هذا الايميل لا يمتلك اي حساب",
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
    res.clearCookie("User");
    res.clearCookie("Doctor");
    res.redirect("/pationt/signIn");
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
