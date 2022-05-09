const {
  pharmacyController,
  addPharmacyController,
  addPharmacyControllerPost,
  activePharmacy,
  editPharmasyController,
  editPharmasyControllerPost,
  allOrdersController,
  showOrderDataController,
} = require("../../controllers/backEnd/pharmacy.controller");

const { uploade_img } = require("../../helper/helper");
const {
  AddSpecialist_validation,
} = require("../../validation/backEnd/specialist_validation");
const {
  DoctorSeting,
} = require("../../validation/frontEnd/doctor/auth_validation");
const {
  pharmacy_validate,
} = require("../../validation/frontEnd/pharmacy.validate");

const Router = require("express").Router();
Router.get("/AllPharmacy", pharmacyController);
Router.get("/AddPharmacy", addPharmacyController);
Router.post(
  "/AddPharmacy",
  uploade_img("public/backEnd/assets/img/pharmacyImage", "image"),
  pharmacy_validate(),
  addPharmacyControllerPost
);
Router.get("/editPharmasy/:id", editPharmasyController);
Router.post(
  "/editPharmasy/:id",
  uploade_img("public/backEnd/assets/img/pharmacyImage", "image"),
  pharmacy_validate(),
  editPharmasyControllerPost
);
Router.get("/activePharmacy/:id", activePharmacy);
Router.get("/allOrders", allOrdersController);
Router.get("/showOrderData/:id", showOrderDataController);

module.exports = {
  pharmacy: Router,
};
