const { validationResult } = require("express-validator");
const {
  tryError,
  handel_validation_errors,
  removeImgFiled,
  Rename_uploade_img_multiFild,
  removeImg,
  returnWithMessage,
  formateDate,
} = require("../../Helper/helper");
const db = require("../../models");

/*--------------- start showAll_doctors page ---------------------*/
const showAll_doctors = async (req, res, next) => {
  try {
    var doctors = await db.doctors.findAll({
      include: [
        { model: db.specialist, as: "DoctorSpecialist", attributes: ["name"] },
      ],
    });
    res.render("backEnd/doctors/showAll", {
      title: "showAll doctors",
      URL: req.url,
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctors,
      doctors,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res);
  }
};
/*--------------- end showAll_doctors page ---------------------*/

/*--------------- start Add_doctor page ---------------------*/
const Edit_doctor = async (req, res, next) => {
  try {
    var doctor = await db.doctors.findOne({
      include: [{ model: db.clinic, as: "Doctorclinic", required: false }],
      where: {
        id: req.params.id,
      },
    });

    var specialist = await db.specialist.findAll();
    res.render("backEnd/doctors/editDoctor", {
      title: "edit doctor",
      URL: req.url,
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      validationError: req.flash("validationError")[0],
      doctor,
      specialist,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*--------------- end Add_doctor page ---------------------*/

/*--------------- start Add_doctor page ---------------------*/
const editDoctor_post = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImgFiled([req.files.clinicImage, req.files.doctorImage]);
      handel_validation_errors(
        req,
        res,
        errors,
        "/doctors/editDoctor/" + req.params.id
      );
      return;
    }

    var files = Rename_uploade_img_multiFild([
      req.files.clinicImage,
      req.files.doctorImage,
    ]);

    var doctorData = req.body;

    if (files.clinicImage) {
      if (req.body.OldclinicImage)
        removeImg(req, "doctors/", req.body.OldclinicImage);
    }
    if (files.doctorImage) {
      if (req.body.OlddoctorImage)
        removeImg(req, "doctors/", req.body.OlddoctorImage);
    }
    console.log(req.body);
    doctorData.doctorImage = files.doctorImage
      ? files.doctorImage
      : req.body.OlddoctorImage;
    doctorData.clinic.clinicImage = files.clinicImage
      ? files.clinicImage
      : req.body.OldclinicImage;
    doctorData.phone = doctorData.phone ? doctorData.phone : null;
    doctorData.gender = doctorData.gender ? doctorData.gender : null;
    doctorData.isFree = doctorData.rating_option == "price_free" ? false : true;
    doctorData.specialist = doctorData.specialist
      ? doctorData.specialist
      : null;
    doctorData.price =
      doctorData.price && doctorData.rating_option != "price_free"
        ? doctorData.price
        : null;
    doctorData.gender = doctorData.gender ? doctorData.gender : null;
    await db.doctors.update(doctorData, {
      where: {
        id: req.body.id,
      },
    });
    var clinic = await db.clinic.findOne({
      where: {
        doctorId: req.body.id,
      },
    });
    if (clinic) {
      await db.clinic.update(doctorData.clinic, {
        where: {
          doctorId: req.params.id,
        },
      });
    } else {
      doctorData.clinic.doctorId = req.body.id;
      await db.clinic.create(doctorData.clinic);
    }
    returnWithMessage(
      req,
      res,
      "/doctors/editDoctor/" + req.params.id,
      "successful Update",
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
    var doctor = await db.doctors.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(doctor);
    await db.doctors.update(
      { isActive: !doctor.isActive },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    returnWithMessage(
      req,
      res,
      "/doctors/showAll_doctors",
      !doctor.active
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
  showAll_doctors,
  Edit_doctor,
  editDoctor_post,
  activeDoctor,
};
