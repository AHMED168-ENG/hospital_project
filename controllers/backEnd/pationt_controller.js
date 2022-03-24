const { validationResult } = require("express-validator");
const {
  tryError,
  handel_validation_errors,
  removeImgFiled,
  Rename_uploade_img_multiFild,
  removeImg,
  returnWithMessage,
  formateDate,
  Rename_uploade_img,
} = require("../../Helper/helper");
const db = require("../../models");

/*--------------- start showAll_doctors page ---------------------*/
const showAll_pationt = async (req, res, next) => {
  try {
    var pationt = await db.users.findAll({
      where: {
        isDoctor: false,
      },
    });
    res.render("backEnd/pationt/showAll", {
      title: "showAll pationts",
      URL: req.url,
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      pationt,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end showAll_doctors page ---------------------*/

/*--------------- start Add_doctor page ---------------------*/
const Edit_pationt = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.render("backEnd/pationt/editPationt", {
      title: "edit pationt",
      URL: req.url,
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      user,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end Add_doctor page ---------------------*/

/*--------------- start Add_doctor page ---------------------*/
const edit_pationt_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(
        req,
        res,
        errors,
        "/pationt/editPationt/" + req.params.id
      );
      return;
    }
    var userData = req.body;
    var image = Rename_uploade_img(req);
    if (image) {
      removeImg(req, "patients/", userData.OldpationtImage);
    } else {
      image = userData.OldpationtImage;
    }
    userData.image = image;
    userData.Date_brith = userData.Date_brith ? userData.Date_brith : null;
    await db.users.update(userData, {
      where: {
        id: req.params.id,
      },
    });
    returnWithMessage(
      req,
      res,
      "/pationt/editPationt/" + req.params.id,
      "success update",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end Add_doctor page ---------------------*/

/*--------------- start active Doctor page ---------------------*/
const activeDoctor = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    await db.users.update(
      { active: !user.active },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    returnWithMessage(
      req,
      res,
      "/pationt/showAll_pationt",
      !user.active
        ? "acctivate doctor successful"
        : "disacctivate doctor successful",
      "success"
    );
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end active Doctor page ---------------------*/

module.exports = {
  showAll_pationt,
  Edit_pationt,
  edit_pationt_post,
  activeDoctor,
};
