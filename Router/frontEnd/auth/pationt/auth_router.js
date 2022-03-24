const {
  signIn_controller,
  signUp_controller,
  signUp_controller_post,
  activeUserPage,
  signOut,
  signIn_controller_post,
} = require("../../../../controllers/frontEnd/auth/pationt/auth_controller");
const { uploade_img } = require("../../../../Helper/helper");
const {
  signUp_validation,
  signInValidation,
} = require("../../../../validation/frontEnd/pationt/auth_validation");
const {
  userAuthonticat,
} = require("../../../../middel_ware/frontEnd/userAuthonticate");
const {
  userNotAuthonticat,
} = require("../../../../middel_ware/frontEnd/usernotAuthonticat");
const Router = require("express").Router();

Router.get("/signIn", userNotAuthonticat, signIn_controller);
Router.post(
  "/signIn",
  userNotAuthonticat,
  signInValidation(),
  signIn_controller_post
);
Router.get("/signUp", userNotAuthonticat, signUp_controller);
Router.post(
  "/signUp",
  userNotAuthonticat,
  uploade_img("public/backEnd/assets/img/patients", "image"),
  signUp_validation(),
  signUp_controller_post
);
Router.get("/activeUserPage/:id", userNotAuthonticat, activeUserPage);
Router.post("/signOut", userAuthonticat, signOut);

module.exports = {
  pationtAuth_router: Router,
};
