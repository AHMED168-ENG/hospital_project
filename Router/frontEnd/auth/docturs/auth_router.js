const {
  signIn_controller,
  signUp_controller,
  signOut,
  signUp_controller_post,
  signIn_controller_post,
} = require("../../../../controllers/frontEnd/auth/docturs/auth_controller");

const {
  userAuthonticat,
} = require("../../../../middel_ware/frontEnd/userAuthonticate");
const {
  DoctorAuthonticat,
} = require("../../../../middel_ware/frontEnd/doctor/AuthonticateDoctor");
const {
  DoctorNotAuthonticat,
} = require("../../../../middel_ware/frontEnd/doctor/notAuthonticatDoctor");
const { uploade_img_multi_fild } = require("../../../../Helper/helper");
const {
  signUp_validation,
  signInValidation,
} = require("../../../../validation/frontEnd/doctor/auth_validation");
const Router = require("express").Router();

Router.get("/signIn", userAuthonticat, DoctorNotAuthonticat, signIn_controller);
Router.post(
  "/signIn",
  userAuthonticat,
  DoctorNotAuthonticat,
  signInValidation(),
  signIn_controller_post
);

Router.get("/signUp", userAuthonticat, DoctorNotAuthonticat, signUp_controller);
Router.post(
  "/signUp",
  userAuthonticat,
  DoctorNotAuthonticat,
  uploade_img_multi_fild(
    [
      {
        name: "birthImage",
      },
      {
        name: "Graduation",
      },
    ],
    "public/backEnd/assets/img/doctors"
  ),
  signUp_validation(),
  signUp_controller_post
);

Router.post("/signOut", userAuthonticat, DoctorAuthonticat, signOut);

module.exports = {
  doctorAuth_router: Router,
};
