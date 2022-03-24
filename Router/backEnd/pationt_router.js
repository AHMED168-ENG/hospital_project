const {
  Edit_doctor,
  editDoctor_post,
  activeDoctor,
  showAll_pationt,
  Edit_pationt,
  edit_pationt_post,
} = require("../../controllers/backEnd/pationt_controller");
const { uploade_img_multi_fild, uploade_img } = require("../../helper/helper");
const {
  DoctorSeting,
} = require("../../validation/frontEnd/doctor/auth_validation");
const {
  signUp_validation,
} = require("../../validation/frontEnd/pationt/auth_validation");

const Router = require("express").Router();

Router.get("/showAll_pationt", showAll_pationt);
Router.get("/editPationt/:id", Edit_pationt);
Router.get("/activePationt/:id", activeDoctor);
Router.post(
  "/editPationt/:id",
  uploade_img("public/backEnd/assets/img/patients", "pationtImage"),
  signUp_validation(),
  edit_pationt_post
);
module.exports = {
  pationt_router: Router,
};
