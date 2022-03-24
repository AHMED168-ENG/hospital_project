const {
  pationt_dashpored,
  pationtfavoritDoctors,
  pationt_setings,
  pationt_setings_post,
  resetPassword,
  resetPassword_post,
} = require("../../controllers/frontEnd/pationtController");
const { uploade_img } = require("../../Helper/helper");
const {
  userAuthonticat,
} = require("../../middel_ware/frontEnd/userAuthonticate");
const {
  signUp_validation,
  resetPassword_validation,
} = require("../../validation/frontEnd/pationt/auth_validation");

const Router = require("express").Router();

Router.get("/pationt_dashpored", userAuthonticat, pationt_dashpored);
Router.get("/pationtfavoritDoctors", userAuthonticat, pationtfavoritDoctors);
Router.get("/pationt_setings", userAuthonticat, pationt_setings);
Router.post(
  "/pationt_setings",
  userAuthonticat,
  uploade_img("public/backEnd/assets/img/patients", "pationtImage"),
  signUp_validation(),
  pationt_setings_post
);
Router.get("/resetPassword", userAuthonticat, resetPassword);
Router.post(
  "/resetPassword",
  userAuthonticat,
  resetPassword_validation(),
  resetPassword_post
);

module.exports = {
  pationtRouter: Router,
};
