const { validationResult } = require("express-validator");
const {
  tryError,
  removeImg,
  Rename_uploade_img,
  handel_validation_errors,
  returnWithMessage,
  formateDate,
} = require("../../Helper/helper");
const db = require("../../models");

/*--------------- start all pharmacy page ---------------------*/
const pharmacyController = async (req, res, next) => {
  try {
    allPharmacy = await db.medicin.findAll({});
    res.render("backEnd/pharmacy/allPharmacy", {
      title: "allPharmacy",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
      allPharmacy,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end all pharmacy page ---------------------*/
/*--------------- start addPharmacyController page ---------------------*/
const addPharmacyController = async (req, res, next) => {
  try {
    res.render("backEnd/pharmacy/addPharmacy", {
      title: "add Pharmacy",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end addPharmacyController page ---------------------*/

/*--------------- start editPharmasyController page ---------------------*/
const editPharmasyController = async (req, res, next) => {
  try {
    var pharmacy = await db.medicin.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/pharmacy/editPharmacy", {
      title: "edit Pharmasy",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
      pharmacy,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end editPharmasyController page ---------------------*/

/*--------------- start editPharmasyController page ---------------------*/
const editPharmasyControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req, "pharmacyImage/");
      handel_validation_errors(
        req,
        res,
        errors,
        "/Pharmacy/editPharmasy/" + req.params.id
      );
      return;
    }

    var files = Rename_uploade_img(req);
    if (files) {
      req.body.image = files;
      if (req.body.oldImage)
        removeImg(req, "pharmacyImage/", req.body.oldImage);
    }
    req.body.isActive = req.body.isActive ? true : false;
    await db.medicin.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    returnWithMessage(
      req,
      res,
      "/Pharmacy/editPharmasy/" + req.params.id,
      "added successful",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end editPharmasyController page ---------------------*/

/*--------------- start addPharmacyControllerPost page ---------------------*/
const addPharmacyControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req, "pharmacyImage/");
      handel_validation_errors(req, res, errors, "/pharmacy/AddPharmacy");
      return;
    }

    var files = Rename_uploade_img(req);
    var data = req.body;
    if (files) data.image = files;
    await db.medicin.create(req.body);
    returnWithMessage(
      req,
      res,
      "/pharmacy/AddPharmacy",
      "added successful",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end addPharmacyControllerPost page ---------------------*/

const activePharmacy = async (req, res, next) => {
  try {
    await db.medicin.update(
      { isActive: req.query.isActive == "1" ? false : true },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    returnWithMessage(
      req,
      res,
      "/pharmacy/AllPharmacy",
      "activat successful",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
const allOrdersController = async (req, res, next) => {
  try {
    var allOrders = await db.pharmacyOrders.findAll({});
    res.render("backEnd/pharmacy/allOrders", {
      title: "Mack Order",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctors,
      allOrders,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res);
  }
};

const showOrderDataController = async (req, res, next) => {
  try {
    var order = await db.pharmacyOrders.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/pharmacy/showOrderData", {
      title: "Mack Order",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctors,
      order,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res);
  }
};
module.exports = {
  pharmacyController,
  addPharmacyController,
  showOrderDataController,
  addPharmacyControllerPost,
  activePharmacy,
  editPharmasyController,
  editPharmasyControllerPost,
  allOrdersController,
};
