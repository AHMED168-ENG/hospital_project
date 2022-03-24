const {
  doctor_dashpored,
  doctorSeting,
  resetPassword,
  resetPassword_post,
  appointMent,
  myPationts,
  schedual,
  editDoctor_post,
  invoices,
  reviews,
  chat_doctor,
  socialmedia,
  socialmedia_post,
  add_schedual_post,
  delete_schedual,
} = require("../../controllers/frontEnd/doctorController");
const { uploade_img, uploade_img_multi_fild } = require("../../Helper/helper");
const {
  DoctorAuthonticat,
} = require("../../middel_ware/frontEnd/doctor/AuthonticateDoctor");
const {
  userAuthonticat,
} = require("../../middel_ware/frontEnd/userAuthonticate");
const {
  signUp_validation,
  resetPassword_validation,
  DoctorSeting,
} = require("../../validation/frontEnd/doctor/auth_validation");

const Router = require("express").Router();

Router.get(
  "/doctour_dashpored",
  userAuthonticat,
  DoctorAuthonticat,
  doctor_dashpored
);
Router.get("/appointMent", userAuthonticat, DoctorAuthonticat, appointMent);
Router.get("/myPationts", userAuthonticat, DoctorAuthonticat, myPationts);
Router.get("/schedual", userAuthonticat, DoctorAuthonticat, schedual);
Router.post(
  "/add_schedual_post",
  userAuthonticat,
  DoctorAuthonticat,
  add_schedual_post
);
Router.post(
  "/delete_schedual",
  userAuthonticat,
  DoctorAuthonticat,
  delete_schedual
);
Router.get("/invoices", userAuthonticat, DoctorAuthonticat, invoices);
Router.get("/reviews", userAuthonticat, DoctorAuthonticat, reviews);
Router.get("/chat_doctor", userAuthonticat, DoctorAuthonticat, chat_doctor);
Router.get("/doctor_setings", userAuthonticat, DoctorAuthonticat, doctorSeting);
Router.get("/socialmedia", userAuthonticat, DoctorAuthonticat, socialmedia);
Router.post(
  "/socialmedia",
  userAuthonticat,
  DoctorAuthonticat,
  socialmedia_post
);
Router.post(
  "/doctor_setings",
  userAuthonticat,
  DoctorAuthonticat,
  DoctorAuthonticat,
  uploade_img_multi_fild(
    [
      {
        name: "doctorImage",
      },
      {
        name: "clinicImage",
      },
    ],
    "public/backEnd/assets/img/doctors"
  ),
  DoctorSeting(),
  editDoctor_post
);
Router.get("/resetPassword", userAuthonticat, DoctorAuthonticat, resetPassword);
Router.post(
  "/resetPassword",
  userAuthonticat,
  DoctorAuthonticat,
  resetPassword_validation(),
  resetPassword_post
);

module.exports = {
  doctotrRouter: Router,
};
