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

/*--------------- start all Labs page ---------------------*/
const LabsController = async (req, res, next) => {
  try {
    allLabs = await db.labs.findAll();
    res.render("backEnd/Labs/allLabs", {
      title: "allLabs",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
      allLabs,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end all Labs page ---------------------*/
/*--------------- start addLabsController page ---------------------*/
const addLabsController = async (req, res, next) => {
  try {
    res.render("backEnd/Labs/addLabs", {
      title: "add Labs",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end addLabsController page ---------------------*/

/*--------------- start editPharmasyController page ---------------------*/
const editLabsController = async (req, res, next) => {
  try {
    var Lab = await db.labs.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/Labs/editLabs", {
      title: "edit Labs",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      URL: req.url,
      Lab,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end editPharmasyController page ---------------------*/

/*--------------- start editPharmasyController page ---------------------*/
const editLabsControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req, "LabsImage/");
      handel_validation_errors(
        req,
        res,
        errors,
        "/Labs/editLabs/" + req.params.id
      );
      return;
    }

    var files = Rename_uploade_img(req);
    if (files) {
      req.body.image = files;
      if (req.body.oldImage) removeImg(req, "LabsImage/", req.body.oldImage);
    }
    req.body.isActive = req.body.isActive ? true : false;
    await db.labs.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    returnWithMessage(
      req,
      res,
      "/Labs/editLabs/" + req.params.id,
      "added successful",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end editPharmasyController page ---------------------*/

/*--------------- start addLabsControllerPost page ---------------------*/
const addLabsControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req, "LabsImage/");
      handel_validation_errors(req, res, errors, "/Labs/AddLabs");
      return;
    }

    var files = Rename_uploade_img(req);
    if (files) req.body.image = files;
    await db.labs.create(req.body);
    returnWithMessage(req, res, "/Labs/AddLabs", "added successful", "success");
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end addLabsControllerPost page ---------------------*/

const activeLabs = async (req, res, next) => {
  try {
    await db.labs.update(
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
      "/Labs/AllLabs",
      "activat successful",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
const allOrdersController = async (req, res, next) => {
  try {
    var allOrders = await db.LabsOrders.findAll({});
    res.render("backEnd/Labs/allOrders", {
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

const deleteLap = async (req, res, next) => {
  try {
    await db.labs.destroy({
      where: {
        id: req.body.id,
      },
    });
    removeImg(req, "LabsImage/", req.body.oldImage);
    returnWithMessage(req, res, "/Labs/AllLabs", "delete success", "danger");
  } catch (error) {
    tryError(res, error);
  }
};

const showOrderDataController = async (req, res, next) => {
  try {
    var order = await db.LabsOrders.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/Labs/showOrderData", {
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
  LabsController,
  addLabsController,
  showOrderDataController,
  addLabsControllerPost,
  activeLabs,
  editLabsController,
  editLabsControllerPost,
  allOrdersController,
  deleteLap,
};
