const { validationResult } = require("express-validator");
const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
  Rename_uploade_img_multiFild,
  formateDate,
} = require("../../Helper/helper");
const db = require("../../models");
const bcrypt = require("bcrypt");

/*------------------------------ start home Page ------------------------*/
const doctor_dashpored = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/DoctorDashpored", {
      title: "Doctor dashpored",
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
/*------------------------------ start appointMent Page ------------------------*/
const appointMent = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/appointMent", {
      title: "Doctor appointMent",
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
/*------------------------------ start appointMent Page ------------------------*/
/*------------------------------ start myPationts Page ------------------------*/
const myPationts = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/myPationts", {
      title: "Doctor Pationts",
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
/*------------------------------ start myPationts Page ------------------------*/
/*------------------------------ start schedual Page ------------------------*/
const schedual = async (req, res, next) => {
  try {
    var schedual = await db.schedual.findOne({
      where: {
        doctorId: req.cookies.Doctor.id,
      },
    });
    res.render("frontEnd/userPages/doctor/schedual", {
      title: "Doctor schedual",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      URL: req.url,
      doctor: req.cookies.Doctor,
      schedual,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------------------ start schedual Page ------------------------*/
/*------------------------------ start schedual Post Page ------------------------*/
const add_schedual_post = async (req, res, next) => {
  try {
    var schedual = await db.schedual.findOne({
      where: {
        doctorId: req.cookies.Doctor.id,
      },
    });
    var test = false;
    if (schedual) {
      if (schedual[req.body.day]) {
        req.body.start.forEach((ele, i) => {
          if (schedual[req.body.day].includes(ele + "__" + req.body.end[i])) {
            test = true;
          }
          schedual[req.body.day].push(ele + "__" + req.body.end[i]);
        });
      } else {
        schedual[req.body.day] = [req.body.start[0] + "__" + req.body.end[0]];
        for (var x = 1; x < req.body.start.length; x++) {
          schedual[req.body.day].push(
            req.body.start[x] + "__" + req.body.end[x]
          );
        }
      }
      if (test) {
        returnWithMessage(
          req,
          res,
          "schedual",
          "this time is existed",
          "danger"
        );
        return;
      }
      var schedual = await db.schedual.update(
        {
          [req.body.day]: schedual[req.body.day],
        },
        {
          where: {
            doctorId: req.cookies.Doctor.id,
          },
        }
      );
    } else {
      var schedual = await db.schedual.create({
        doctorId: req.cookies.Doctor.id,
        [req.body.day]: [req.body.start + "__" + req.body.end],
      });
    }
    returnWithMessage(req, res, "schedual", "Added Successful", "success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start schedual Post Page ------------------------*/

/*------------------------------ start schedual delete Post Page ------------------------*/
const delete_schedual = async (req, res, next) => {
  try {
    var schedual = await db.schedual.findOne({
      where: {
        doctorId: req.cookies.Doctor.id,
      },
    });
    schedual[req.body.day].splice(req.body.index, 1);
    var schedual = await db.schedual.update(
      {
        [req.body.day]: schedual[req.body.day],
      },
      {
        where: {
          doctorId: req.cookies.Doctor.id,
        },
      }
    );
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end schedual delete Post Page ------------------------*/

/*------------------------------ start invoices Page ------------------------*/
const invoices = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/invoice", {
      title: "Doctor schedual",
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
/*------------------------------ start invoices Page ------------------------*/
/*------------------------------ start invoices Page ------------------------*/
const reviews = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/reviews", {
      title: "Doctor schedual",
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
/*------------------------------ start invoices Page ------------------------*/
/*------------------------------ start invoices Page ------------------------*/
const chat_doctor = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/chat", {
      title: "Doctor schedual",
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
/*------------------------------ start invoices Page ------------------------*/

/*------------------------------ start doctor_setings Page ------------------------*/
const doctorSeting = async (req, res, next) => {
  try {
    var specialist = await db.specialist.findAll({
      where: {
        active: true,
      },
    });
    var doctors = await db.doctors.findOne({
      include: [{ model: db.clinic, as: "Doctorclinic" }],
      where: {
        id: req.cookies.Doctor.id,
      },
    });
    res.render("frontEnd/userPages/doctor/doctorSeting", {
      title: "userProfile setings",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: doctors,
      URL: req.url,
      specialist,
      FormData: formateDate,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start doctor_setings Page ------------------------*/
/*------------------------------ start doctor_setings Page ------------------------*/
const socialmedia = async (req, res, next) => {
  try {
    var socialMedia = await db.doctorSocialMedia.findOne({
      where: {
        doctorId: req.cookies.Doctor.id,
      },
    });
    res.render("frontEnd/userPages/doctor/socialmedia", {
      title: "userProfile setings",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctor,
      URL: req.url,
      socialMedia,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------------------ start doctor_setings Page ------------------------*/
/*------------------------------ start socialmedia Page ------------------------*/
const socialmedia_post = async (req, res, next) => {
  try {
    var socialDoctorData = req.body;
    var socialMedia = await db.doctorSocialMedia.findOne({
      where: {
        doctorId: req.cookies.Doctor.id,
      },
    });
    if (socialMedia) {
      await db.doctorSocialMedia.update(socialDoctorData, {
        where: {
          doctorId: req.cookies.Doctor.id,
        },
      });
    } else {
      socialDoctorData.doctorId = req.cookies.Doctor.id;
      await db.doctorSocialMedia.create(socialDoctorData);
    }
    returnWithMessage(
      req,
      res,
      "socialmedia",
      "Good Update For Social Media Doctor",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end socialmedia Page ------------------------*/

/*--------------- start Add_doctor page ---------------------*/
const editDoctor_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImgFiled([req.files.clinicImage, req.files.doctorImage]);
      handel_validation_errors(req, res, errors, "/doctor/doctor_setings");
      return;
    }

    var files = Rename_uploade_img_multiFild([
      req.files.clinicImage,
      req.files.doctorImage,
    ]);
    var doctorData = req.body;

    doctorData.doctorImage = files.doctorImage
      ? files.doctorImage
      : req.body.OlddoctorImage;
    doctorData.clinic.clinicImage = files.clinicImage
      ? files.clinicImage
      : req.body.OldclinicImage;
    doctorData.phone = doctorData.phone ? doctorData.phone : null;
    doctorData.gender = doctorData.gender ? doctorData.gender : null;
    doctorData.isFree = doctorData.rating_option == "price_free" ? false : true;
    doctorData.specialist = doctorData.specialist
      ? doctorData.specialist
      : null;
    doctorData.price =
      doctorData.price && doctorData.rating_option != "price_free"
        ? doctorData.price
        : null;
    doctorData.gender = doctorData.gender ? doctorData.gender : null;
    await db.doctors.update(doctorData, {
      where: {
        id: req.body.id,
      },
    });
    var clinic = await db.clinic.findOne({
      where: {
        doctorId: req.body.id,
      },
    });
    if (clinic) {
      await db.clinic.update(doctorData.clinic, {
        where: {
          doctorId: req.body.id,
        },
      });
    } else {
      doctorData.clinic.doctorId = req.body.id;
      await db.clinic.create(doctorData.clinic);
    }

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
/*--------------- end Add_doctor page ---------------------*/
/*------------------------------ start resetPassword Page ------------------------*/
const resetPassword = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/doctor/resetPassword", {
      title: "resetPassword",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
      doctor: req.cookies.Doctor,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start resetPassword Page ------------------------*/

/*------------------------------ start resetPassword_post Page ------------------------*/
const resetPassword_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "resetPassword");
      return;
    }
    var passwordData = req.body;
    var hashPassword = bcrypt.hashSync(passwordData.password, 10);
    await db.doctors.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: req.cookies.Doctor.id,
        },
      }
    );
    res.clearCookie("Doctor");
    returnWithMessage(
      req,
      res,
      "signIn",
      "Sign In again Becouse We Update Your Doctor Account",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start resetPassword_post Page ------------------------*/

module.exports = {
  doctor_dashpored,
  doctorSeting,
  editDoctor_post,
  resetPassword,
  resetPassword_post,
  appointMent,
  myPationts,
  schedual,
  invoices,
  reviews,
  chat_doctor,
  socialmedia,
  socialmedia_post,
  add_schedual_post,
  delete_schedual,
};
