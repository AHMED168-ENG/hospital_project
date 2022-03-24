const {
  showAll_doctors,
  Edit_doctor,
  editDoctor_post,
  activeDoctor,
} = require("../../controllers/backEnd/doctors_controller");
const { uploade_img_multi_fild } = require("../../helper/helper");
const {
  DoctorSeting,
} = require("../../validation/frontEnd/doctor/auth_validation");

const Router = require("express").Router();

Router.get("/showAll_doctors", showAll_doctors);
Router.get("/editDoctor/:id", Edit_doctor);
Router.get("/activeDoctor/:id", activeDoctor);
Router.post(
  "/editDoctor/:id",
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
module.exports = {
  doctors_router: Router,
};
