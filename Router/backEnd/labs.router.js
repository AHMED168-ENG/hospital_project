const {
  LabsController,
  addLabsController,
  addLabsControllerPost,
  editLabsController,
  editLabsControllerPost,
  activeLabs,
} = require("../../controllers/backEnd/labs.controller");
const {
  addPharmacyController,
  addPharmacyControllerPost,
  activePharmacy,
  editPharmasyController,
  editPharmasyControllerPost,
  allOrdersController,
  showOrderDataController,
  editLabControllerPost,
} = require("../../controllers/backEnd/pharmacy.controller");

const { uploade_img } = require("../../helper/helper");
const {
  pharmacy_validate,
} = require("../../validation/frontEnd/pharmacy.validate");

const Router = require("express").Router();
Router.get("/AllLabs", LabsController);
Router.get("/AddLabs", addLabsController);
Router.post(
  "/AddLabs",
  uploade_img("public/backEnd/assets/img/LabsImage", "image"),
  pharmacy_validate(),
  addLabsControllerPost
);
Router.get("/editLabs/:id", editLabsController);
Router.post(
  "/editLabs/:id",
  uploade_img("public/backEnd/assets/img/LabsImage", "image"),
  pharmacy_validate(),
  editLabsControllerPost
);
Router.get("/activeLab/:id", activeLabs);

module.exports = {
  Labs: Router,
};
