const {
  tryError,
  defaultLanguage,
  getMainCatigory,
  formateDate,
  handel_validation_errors,
  removeImg,
  removeImgFiled,
  uploade_img,
  Rename_uploade_img,
  returnWithMessage,
  Rename_uploade_img_multiFild,
  getSumOfArray,
} = require("../../Helper/helper");
const { sequelize, Op } = require("sequelize");
const db = require("../../models");
const paginate = require("express-paginate");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const emoji = require("node-emoji");

/* const emoji = require("node-emoji");
 */
/*------------------------------ start home Page ------------------------*/
const homePage = async (req, res, next) => {
  try {
    var allSpecialist = await db.specialist.findAll({
      where: {
        active: true,
      },
    });
    var someOfActiveDoctors = await db.users.findAll({
      include: [
        {
          model: db.doctors,
          as: "userDoctorData",
          where: { isActive: true },
        },
      ],
      where: {
        active: true,
      },
      attributes: ["id"],
      order: [["numberOfPosts", "desc"]],
      limit: 10,
    });
    res.render("frontEnd/userPages/homePage", {
      title: "homePage",
      someOfActiveDoctors,
      getRateOp: getSumOfArray,
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctor,
      allSpecialist,
      formateDate: formateDate,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start home Page ------------------------*/

/*------------------------------ start All_Doctors Page ------------------------*/
const All_Doctors = async (req, res, next) => {
  try {
    var doctors = await db.doctors.findAndCountAll({
      include: [
        {
          model: db.specialist,
          as: "DoctorSpecialist",
        },
      ],
      where: {
        isActive: true,
        gender: req.query.gender_type
          ? { [Op.eq]: req.query.gender_type }
          : { [Op.gte]: 0 },
        specialist: req.query.select_specialist
          ? { [Op.eq]: req.query.select_specialist }
          : { [Op.gt]: 0 },
        [Op.or]: [
          {
            fName: req.query.DoctorName
              ? { [Op.like]: req.query.DoctorName + "%" }
              : { [Op.like]: "%%" },
          },
          {
            lName: req.query.DoctorName
              ? { [Op.like]: req.query.DoctorName + "%" }
              : { [Op.like]: "%%" },
          },
        ],
        Addres: req.query.CountryName
          ? { [Op.like]: req.query.CountryName + "%" }
          : { [Op.like]: "%%" },
      },
      order: [
        req.query.filter
          ? [req.query.filter.split("_")[0], req.query.filter.split("_")[1]]
          : ["createdAt", "asc"],
      ],
      limit: req.query.limit,
      offset: (parseInt(req.query.page) - 1) * req.query.limit,
    });
    var specialist = await db.specialist.findAll({
      where: {
        active: true,
      },
    });

    if (req.cookies.User) {
      var userWithDocotr = await db.users.findOne({
        include: [
          { model: db.doctors, as: "userDoctorData", attributes: ["id"] },
        ],
        where: {
          id: req.cookies.User.id,
        },
        attributes: ["id"],
      });
    }

    res.render("frontEnd/userPages/All_Doctors", {
      title: "All_Doctors",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctor,
      doctors,
      specialist,
      Qyery: req.query,
      userWithDocotr,
      getRateOp: getSumOfArray,
      pages: paginate.getArrayPages(req)(
        req.query.limit,
        Math.ceil(doctors.count / req.query.limit),
        req.query.page
      ),
      page: req.query.page,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end All_Doctors Page ------------------------*/

const getSearchDoctorData = async (req, res, next) => {
  try {
    var doctors = await db.doctors.findAll({
      include: [{ model: db.users, as: "DoctorUser", attributes: ["id"] }],
      where: {
        fName: {
          [Op.like]: req.body.search + "%",
        },
        Addres: {
          [Op.like]: req.body.location + "%",
        },
      },
    });
    res.send(doctors);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ start doctorProfile Page ------------------------*/
const doctorProfile = async (req, res, next) => {
  try {
    var schdual = await db.schedual.findOne({
      where: {
        doctorId: req.params.id,
      },
    });
    var doctor = await db.doctors.findOne({
      include: [
        { model: db.specialist, as: "DoctorSpecialist" },
        {
          model: db.doctorComments,
          as: "doctorComment",
          limit: 4,
          order: [["createdAt", "desc"]],
          include: {
            model: db.users,
            as: "commentUser",
            attributes: ["fName", "lName", "image", "id"],
          },
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    var userWithDocotr = await db.users.findOne({
      include: [
        { model: db.doctors, as: "userDoctorData", attributes: ["id"] },
      ],
      where: {
        id: req.cookies.User ? req.cookies.User.id : 0,
      },
      attributes: ["id"],
    });

    if (!doctor) {
      returnWithMessage(
        req,
        res,
        "/All_Doctors",
        "this doctor not hir",
        "danger"
      );
    }
    res.render("frontEnd/userPages/doctorProfile", {
      title: "Doctor Profile",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor,
      userWithDocotr,
      schdual,
      FormData: formateDate,
      getRateOp: getSumOfArray,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end doctorProfile Page ------------------------*/
/*------------------------------ start doctorProfile Page ------------------------*/
const bookingDoctor = async (req, res, next) => {
  try {
    var userWithDocotr = await db.users.findOne({
      include: [
        { model: db.doctors, as: "userDoctorData", attributes: ["id"] },
      ],
      where: {
        id: req.cookies.User.id,
      },
      attributes: ["id"],
    });

    if (
      userWithDocotr.userDoctorData &&
      userWithDocotr.userDoctorData.id == req.params.id
    ) {
      returnWithMessage(
        req,
        res,
        "/All_Doctors",
        "you cant booking in your account",
        "danger"
      );
    }
    var doctor = await db.doctors.findOne({
      include: [
        { model: db.specialist, as: "DoctorSpecialist" },
        {
          model: db.doctorComments,
          as: "doctorComment",
          limit: 4,
          order: [["createdAt", "desc"]],
          include: {
            model: db.users,
            as: "commentUser",
            attributes: ["fName", "lName", "image", "id"],
          },
        },
      ],
      where: {
        id: req.params.id,
      },
    });

    var schdual = await db.schedual.findOne({
      where: {
        doctorId: req.params.id,
      },
    });
    var year = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var dayes = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wenesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var doctorAppointment = await db.doctorAppointment.findAll({
      where: {
        doctorId: req.params.id,
      },
    });
    res.render("frontEnd/userPages/bookingDoctor", {
      title: "booking doctor",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctor,
      doctor,
      schdual,
      getRateOp: getSumOfArray,
      FormData: formateDate,
      year,
      dayes,
      doctorAppointment,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end doctorProfile Page ------------------------*/
/*------------------------------ start doctorProfile Page ------------------------*/
const bookingDoctor_post = async (req, res, next) => {
  try {
    var pationtAppointment = await db.doctorAppointment.findOne({
      where: {
        pationtId: req.body.pationtId,
        doctorId: req.params.id,
      },
    });
    var anyPationtAppointment = await db.doctorAppointment.findOne({
      where: {
        date: req.body.date,
        doctorId: req.params.id,
        time: req.body.time,
        pationtId: {
          [Op.ne]: req.body.pationtId,
        },
      },
    });
    if (anyPationtAppointment) {
      returnWithMessage(
        req,
        res,
        `/bookingDoctor/${req.params.id}`,
        "you cant chose this date becouse this date is booked",
        "danger"
      );
      return;
    } else {
      if (pationtAppointment) {
        if (pationtAppointment.date == req.body.date) {
          await db.doctorAppointment.destroy({
            where: {
              pationtId: req.body.pationtId,
              doctorId: req.params.id,
            },
          });
          returnWithMessage(
            req,
            res,
            `/bookingDoctor/${req.params.id}`,
            "Delete Successful Date",
            "success"
          );
        } else {
          await db.doctorAppointment.update(req.body, {
            where: {
              pationtId: req.body.pationtId,
            },
          });
          returnWithMessage(
            req,
            res,
            `/bookingDoctor/${req.params.id}`,
            "update Date Successful",
            "success"
          );
        }
        return;
      } else {
        req.body.doctorId = req.params.id;
        db.doctorAppointment.create(req.body);
        returnWithMessage(
          req,
          res,
          `/bookingDoctor/${req.params.id}`,
          "Booking Successful Date",
          "success"
        );
      }
    }
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end doctorProfile Page ------------------------*/

/*------------------------------ start addDoctorComment Page ------------------------*/
const addDoctorComment = async (req, res, next) => {
  try {
    var userCommentOnDoctor = await db.doctorComments.findOne({
      where: {
        userId: req.body.userId,
        doctorId: req.body.doctorId,
      },
    });
    if (userCommentOnDoctor) {
      res.send("");
      return;
    }
    await db.doctorComments
      .create({
        comment: req.body.comment,
        userId: req.body.userId,
        doctorId: req.body.doctorId,
        Rate: req.body.rate,
        like: 0,
        disLike: 0,
        disLikeUser: [],
        likeUser: [],
      })
      .then(async (result) => {
        var doctor = await db.doctors.findOne({
          where: {
            id: req.body.doctorId,
          },
        });

        if (doctor.userRate && doctor.userRate.length > 0) {
          doctor.userRate.push(req.body.rate);
          doctor.rating = parseInt(doctor.rating) + parseInt(req.body.rate);
        } else {
          doctor.userRate = [req.body.rate];
          doctor.rating = req.body.rate;
        }

        await db.doctors.update(
          { userRate: doctor.userRate, rating: doctor.rating },
          {
            where: {
              id: req.body.doctorId,
            },
          }
        );

        var commentUser = await db.doctorComments.findOne({
          attributes: ["id"],
          include: {
            model: db.users,
            as: "commentUser",
            attributes: ["fName", "lName", "image", "id"],
          },
          where: {
            id: result.id,
          },
        });
        res.send(commentUser);
      });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------------------ end addDoctorComment Page ------------------------*/

/*------------------ start show search ------------------*/
const getDataSearch_ajax = async (req, res, next) => {
  try {
    var dataSearch = await db.products.findAll({
      limit: 10,
      where: {
        [Op.or]: {
          ["ProductOverview_" + defaultLanguage()]: {
            [Op.like]: "%" + req.body.search + "%",
          },
          ["fullDescription_" + defaultLanguage()]: {
            [Op.like]: "%" + req.body.search + "%",
          },
          ["productName_" + defaultLanguage()]: {
            [Op.like]: "%" + req.body.search + "%",
          },
          keyWord: {
            [Op.like]: "%" + req.body.search + "%",
          },
        },
      },
    });
    res.send(dataSearch);
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end show search ------------------*/

/*------------------ get my account controller ------------------*/
const membersPosts = async (req, res, next) => {
  try {
    var Posts = await db.userPosts.findAndCountAll({
      limit: 5,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: db.users,
          as: "postsUser",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.users,
          as: "postsUserTo",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.likesPosts,
          as: "PostsLikes",
          attributes: ["usersId", "types"],
          required: false,
        },
        {
          model: db.postComments,
          as: "postComments",
          where: { to: null },
          limit: 3,
          required: false,
          order: [["createdAt", "asc"]],
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              where: { active: true },
              attributes: ["id", "fName", "lName", "image", "active"],
            },
            {
              model: db.postComments,
              as: "supComments",
              limit: 1,
              include: [
                {
                  model: db.users,
                  as: "postCommentUser",
                  where: { active: true },
                  attributes: ["id", "fName", "lName", "image", "active"],
                },
              ],
            },
          ],
        },
      ],
    });

    var GetEmojin = function (name) {
      return emoji.get(name);
    };

    function getSomeOfUserEmoji(array) {
      var arr = [];
      for (var i = 0; i < array.length; i++) {
        if (!arr.includes(array[i])) {
          arr.push(array[i]);
        }
        if (arr.length >= 3) break;
      }
      return arr;
    }
    var x = {};

    var allEmoji = require("../../jsonFileForEmoji V2");
    allEmoji.forEach((ele) => {
      if (!x[ele.category]) {
        x[ele.category] = ele.emoji;
      }
    });

    var notificationRequestNumber = 0;
    var userfrindesData = [];

    /* ----------- satrt get user notification --------------*/
    var userNotification = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
      },
      order: [["createdAt", "desc"]],
      limit: 10,
    });

    var userMessagesNotSeen = await db.usersMessage.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    var userNotificationNotSeen = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });

    /* ----------- end get user notification --------------*/

    /* ----------- start chate aside --------------*/

    var chateAside = await db.usersChat.findAll({
      include: [
        { model: db.users, as: "FromChatUser", attributes: ["id", "image"] },
        { model: db.users, as: "chatUser", attributes: ["id", "image"] },
      ],
      where: {
        from: req.cookies.User.id,
        isSaved: true,
      },
      attributes: ["id"],
      order: [["createdAt", "desc"]],
    });

    /* ----------- start chate aside --------------*/

    var moreDataForUser = await db.moreDataForUser.findOne({
      where: {
        userId: req.cookies.User.id,
      },
    });
    var userFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.cookies.User.id,
      },
      attributes: ["frindesId"],
    });
    var userFrindesData = await db.users.findAll({
      where: {
        id: {
          [Op.in]: userFrindes.frindesId,
        },
      },
    });

    res.render("frontEnd/Userpages/membersPosts", {
      title: req.cookies.User.fName,
      notification: req.flash("notification")[0],
      UserCookie: req.cookies.User,
      defaultLang: defaultLanguage(),
      date: formateDate,
      url: req.url,
      Posts,
      userFrindesData,
      data: [],
      GetEmojin: GetEmojin,
      getSomeOfUserEmoji: getSomeOfUserEmoji,
      x,
      notificationRequestNumber,
      moreDataForUser,
      userNotificationNotSeen,
      userNotification,
      userMessagesNotSeen,
      chateAside,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get my account controller ------------------*/
/*------------------ get my account controller ------------------*/
const getMyAccount = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      tryError(res, "هذا المستخدم غير موجود");
    }

    var Posts = await db.userPosts.findAndCountAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ from: user.id }, { to: user.id }],
          },
          {
            [Op.and]: [
              { from: { [Op.ne]: user.id } },
              { to: { [Op.eq]: user.id } },
            ],
          },
        ],
      },
      limit: 4,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: db.users,
          as: "postsUser",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.users,
          as: "postsUserTo",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.likesPosts,
          as: "PostsLikes",
          attributes: ["usersId", "types"],
          required: false,
        },
        {
          model: db.postComments,
          as: "postComments",
          where: { to: null },
          limit: 3,
          required: false,
          order: [["createdAt", "asc"]],
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              where: { active: true },
              attributes: ["id", "fName", "lName", "image", "active"],
            },
            {
              model: db.postComments,
              as: "supComments",
              limit: 1,
              include: [
                {
                  model: db.users,
                  as: "postCommentUser",
                  where: { active: true },
                  attributes: ["id", "fName", "lName", "image", "active"],
                },
              ],
            },
          ],
        },
      ],
    });
    var images = await db.userPosts.findAll({
      where: {
        image: {
          [Op.ne]: null,
        },
        [Op.or]: [
          {
            [Op.and]: [{ from: user.id }, { to: user.id }],
          },
          {
            [Op.and]: [{ from: { [Op.ne]: user.id } }, { to: user.id }],
          },
        ],
      },
      limit: 9,
      attributes: ["image"],
      order: [["createdAt", "asc"]],
    });
    var GetEmojin = function (name) {
      return emoji.get(name);
    };

    function getSomeOfUserEmoji(array) {
      var arr = [];
      for (var i = 0; i < array.length; i++) {
        if (!arr.includes(array[i])) {
          arr.push(array[i]);
        }
        if (arr.length >= 3) break;
      }
      return arr;
    }
    var x = {};

    var allEmoji = require("../../jsonFileForEmoji V2");
    allEmoji.forEach((ele) => {
      if (!x[ele.category]) {
        x[ele.category] = ele.emoji;
      }
    });

    var ifFrind = "no";
    var notificationRequestNumber = 0;
    var userfrindesData = [];

    /* ----------- start get user Frindes --------------*/
    var usersFrind = await db.userFrindes.findOne({
      where: {
        userId: req.cookies.User.id,
      },
    });
    /* ----------- end get user Frindes --------------*/

    /* ----------- start get frind Frindes --------------*/
    var Frinds = await db.userFrindes.findOne({
      where: {
        userId: req.params.id,
      },
    });
    /* ----------- end get frind Frindes --------------*/
    /* ----------- start get frind Frindes users Data --------------*/
    if (Frinds) {
      var userId = Frinds.frindesId.slice(0, 10);
      userfrindesData = await db.users.findAll({
        where: {
          id: {
            [Op.in]: userId,
          },
        },
        attributes: ["image", "id", "fName", "lName"],
      });
    }
    /* ----------- end get frind Frindes users Data --------------*/
    /* ----------- start get user request --------------*/
    var frindRequest1 = await db.frindesRequest.findOne({
      where: {
        to: req.cookies.User.id,
      },
    });
    /* ----------- end get user request --------------*/

    /* ----------- start get frind request --------------*/
    var frindRequest2 = await db.frindesRequest.findOne({
      where: {
        to: req.params.id,
      },
    });
    if (frindRequest1) {
      frindRequest1.notificationSeen.forEach((ele, i) => {
        if (ele == false) {
          notificationRequestNumber += 1;
        }
      });
    }
    /* ----------- end get frind request --------------*/

    /* ----------- satrt get user notification --------------*/
    var userNotification = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
      },
      order: [["createdAt", "desc"]],
      limit: 10,
    });
    var userMessagesNotSeen = await db.usersMessage.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    var userNotificationNotSeen = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    /* ----------- end get user notification --------------*/

    /* ----------- start chate aside --------------*/

    var chateAside = await db.usersChat.findAll({
      include: [
        { model: db.users, as: "FromChatUser", attributes: ["id", "image"] },
        { model: db.users, as: "chatUser", attributes: ["id", "image"] },
      ],
      where: {
        from: req.cookies.User.id,
        isSaved: true,
      },
      attributes: ["id"],
      order: [["createdAt", "desc"]],
    });

    /* ----------- start chate aside --------------*/

    if (usersFrind && usersFrind.frindesId.includes(parseInt(req.params.id))) {
      ifFrind = "yes";
    } else {
      if (
        (frindRequest1 &&
          frindRequest1.from.includes(parseInt(req.params.id))) ||
        (frindRequest2 &&
          frindRequest2.from.includes(parseInt(req.cookies.User.id)))
      ) {
        ifFrind = "pending";
      }
    }

    var moreDataForUser = await db.moreDataForUser.findOne({
      where: {
        userId: req.params.id,
      },
    });
    res.render("frontEnd/Userpages/userProfile", {
      title: req.cookies.User.fName,
      notification: req.flash("notification")[0],
      user,
      UserCookie: req.cookies.User,
      defaultLang: defaultLanguage(),
      date: formateDate,
      url: req.url,
      Posts,
      images,
      data: [],
      GetEmojin: GetEmojin,
      getSomeOfUserEmoji: getSomeOfUserEmoji,
      x,
      ifFrind,
      notificationRequestNumber,
      userfrindesData,
      moreDataForUser,
      userNotificationNotSeen,
      userNotification,
      userMessagesNotSeen,
      chateAside,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get my account controller ------------------*/

/*------------------ get getSearchUserData controller ------------------*/
const getSearchUserData = async (req, res, next) => {
  try {
    var users = await db.users.findAll({
      where: {
        fName: { [Op.like]: `%${req.body.search}%` },
        id: { [Op.ne]: req.body.id },
      },
      attributes: ["image", "fName", "lName", "id"],
    });
    res.send(users);
  } catch (error) {
    tryError(req);
  }
};
/*------------------ get getSearchUserData controller ------------------*/

/*------------------ edit personal information controller ------------------*/
const editPersonalInformationGet = async (req, res, next) => {
  try {
    var frindRequest1 = await db.frindesRequest.findOne({
      where: {
        to: req.cookies.User.id,
      },
    });
    var frindRequestCount = frindRequest1 ? frindRequest1.from.length : 0;

    res.render("frontEnd/Userpages/editPersonalInformation", {
      title: req.cookies.User.fName,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      UserCookie: req.cookies.User,
      url: req.url,
      frindRequestCount,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------ edit personal information controller ------------------*/

/*------------------ edit personal information controller ------------------*/
const editPersonalInformationPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/editPersonalInformation");
      removeImg(req);
      return;
    }
    var image = Rename_uploade_img(req);
    var userData = req.body;
    if (image) {
      userData.image = image;
      removeImg(req, "users_photo/", req.body.oldImage);
    } else {
      userData.image = req.body.oldImage;
    }
    userData.password = req.body.newPassword
      ? bcrypt.hashSync(req.body.newPassword, 10)
      : req.body.oldPassword;
    await db.users.update(userData, {
      where: {
        id: req.cookies.User.id,
      },
    });
    res.clearCookie("User");
    returnWithMessage(
      req,
      res,
      "/signIn",
      "تم تعديل البيانات بنجاح ويجب التسجيل ",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ edit personal information controller ------------------*/

/*-------------------------------------------- start part of posts ----------------------------------------*/

/*----------------------- start part add post ajax --------------------------*/
const addPostAjax = async (req, res, next) => {
  try {
    var files = Rename_uploade_img_multiFild([
      req.files.image,
      req.files.video,
    ]);
    await db.userPosts
      .create({
        post: req.body.post,
        from: req.body.from,
        to: req.body.to ? req.body.to : req.body.from,
        image: files.image ? files.image : null,
        video: files.video ? files.video : null,
        commentNumber: 0,
      })
      .then(async (result) => {
        var userNumberOfPosts = await db.users.findOne({
          where: {
            id: req.cookies.User.id,
          },
          attributes: ["numberOfPosts"],
        });
        await db.users.update(
          { numberOfPosts: parseInt(userNumberOfPosts.numberOfPosts) + 1 },
          {
            where: {
              id: req.body.from,
            },
          }
        );
        res.send([result]);
      });
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------- end part add post ajax --------------------------*/

/*------------------ edit personal information controller ------------------*/
const editPostAjax = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
      attributes: ["image", "video"],
    });

    var files = Rename_uploade_img_multiFild([
      req.files.image,
      req.files.video,
    ]);
    if (files.image) {
      if (post.image) removeImg(req, "posts_image/", post.image);
    }
    if (files.video) {
      if (post.video) removeImg(req, "posts_image/", post.video);
    }
    await db.userPosts.update(
      {
        post: req.body.post,
        image: files.image ? files.image : post.image,
        video: files.video ? files.video : post.video,
      },
      {
        where: {
          id: req.body.postId,
        },
      }
    );
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
    });
    res.send(post);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ edit personal information controller ------------------*/

/*------------------ add likes ------------------*/
const AddLikesAjax = async (req, res, next) => {
  try {
    var userLikes = await db.likesPosts.findOne({
      where: {
        postId: req.body.postId,
      },
    });

    if (userLikes) {
      if (userLikes.usersId.includes(parseInt(req.body.userId))) {
        if (req.body.type != "") {
          userLikes.types.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1,
            req.body.type
          );
        } else {
          userLikes.types.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1
          );
          userLikes.createdAtLikes.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1
          );
          userLikes.usersId.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1
          );

          if (userLikes.types.length == 0) {
            await db.likesPosts.destroy({
              where: {
                postId: req.body.postId,
              },
            });
          }
        }
      } else {
        userLikes.types.push(req.body.type);
        userLikes.usersId.push(req.body.userId);
        userLikes.createdAtLikes.push(new Date());
        if (req.body.frindId != req.cookies.User.id) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.frindId,
            type: `${req.body.type}__Likes__${req.body.postHead}__${req.body.postId}`,
            isSeen: false,
            isRead: false,
          });
        }
      }
      await db.likesPosts.update(
        {
          usersId: userLikes.usersId,
          types: userLikes.types,
          createdAtLikes: userLikes.createdAtLikes,
        },
        {
          where: {
            id: userLikes.id,
          },
        }
      );

      res.send(userLikes.types);
    } else {
      await db.likesPosts
        .create({
          usersId: [req.body.userId],
          postId: req.body.postId,
          types: [req.body.type],
          createdAtLikes: [new Date()],
        })
        .then((result) => {
          res.send([result.types]);
        });
      if (req.body.frindId != req.cookies.User.id) {
        await db.userNotification.create({
          userId: req.body.userId,
          to: req.body.frindId,
          type: `${req.body.type}__Likes__${req.body.postHead}__${req.body.postId}`,
          isSeen: false,
          isRead: false,
        });
      }
    }
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ add likes ------------------*/

/*------------------ add comment on posts ------------------*/
const addCommentOnPosts = async (req, res, next) => {
  try {
    var images = Rename_uploade_img(req);
    await db.postComments
      .create({
        comment: req.body.comment,
        userId: req.body.userId,
        postId: req.body.postId,
        to: req.body.to ? req.body.to : null,
        images: images ? images : null,
      })
      .then(async (result) => {
        var comment = await db.postComments.findOne({
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              attributes: ["fName", "lName", "image", "id"],
            },
          ],
          where: {
            id: result.id,
          },
          attributes: ["comment", "id"],
        });

        var post = await db.userPosts.findOne({
          where: {
            id: req.body.postId,
          },
        });

        if (req.body.frindId != req.body.userId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.frindId,
            type: `comment__Comment__${
              req.body.to ? req.body.comment : post.post
            }__${req.body.to}__${comment.id}__${req.body.postId}`,
            isSeen: false,
            isRead: false,
          });
        }

        await db.userPosts.update(
          {
            commentNumber: post.commentNumber
              ? parseInt(post.commentNumber) + 1
              : 1,
          },
          {
            where: {
              id: req.body.postId,
            },
          }
        );
        res.send([comment, formateDate(comment.createdAt)]);
      });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ add comment on posts ------------------*/

/*------------------ delete comment on posts ------------------*/
const deleteCommentAjax = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
      attributes: ["commentNumber"],
    });
    post = parseInt(post.commentNumber);
    async function getCommentId(id) {
      var comments = await db.postComments.findAll({
        where: {
          to: id,
        },
        attributes: ["id", "to", "postId", "images"],
      });
      return comments;
    }

    function setIds(test) {
      while (test.length > 0) {
        test.forEach(async (ele) => {
          await db.postComments.destroy({
            where: {
              id: ele.id,
            },
          });
          if (ele.images) removeImg(req, "comment_photo/", ele.images);
          post -= 1;
          await db.userPosts.update(
            { commentNumber: post },
            {
              where: {
                id: req.body.postId,
              },
            }
          );

          setIds(await getCommentId(ele.id));
        });
        test = [];
      }
    }
    setIds(await getCommentId(req.body.commentId));
    var comment = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
      attributes: ["images"],
    });
    if (comment.images) removeImg(req, "comment_photo/", comment.images);

    await db.postComments.destroy({
      where: {
        id: req.body.commentId,
      },
    });
    post -= 1;
    await db.userPosts.update(
      { commentNumber: post },
      {
        where: {
          id: req.body.postId,
        },
      }
    );
    res.send("delete success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ delete comment on posts ------------------*/

/*------------------ update comment on posts ------------------*/
const editCommentAjax = async (req, res, next) => {
  try {
    var image = Rename_uploade_img(req);
    var comment = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
      attributes: ["images"],
    });
    if (image) {
      if (comment.images) removeImg(req, "comment_photo/", comment.images);
    } else if (req.body.numberOFimage) {
      image = "";
      comment.images.split("--").forEach((ele, i) => {
        if (ele.trim() == "") return;
        if (req.body.numberOFimage.split(",").includes(i + "")) {
          removeImg(req, "comment_photo/", ele + "--");
        } else {
          image += ele + "--";
        }
      });
    } else {
      image = comment.images;
    }

    await db.postComments.update(
      {
        comment: req.body.comment,
        images: image ? image : null,
      },
      {
        where: {
          id: req.body.commentId,
        },
      }
    );

    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ update comment on posts ------------------*/

/*------------------ getCommentData on posts ------------------*/
const getCommentData = async (req, res, next) => {
  try {
    var commentData = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
      attributes: ["images", "comment"],
    });
    res.send(commentData);
  } catch (error) {
    tryError(res);
  }
};
/*------------------ getCommentData on posts ------------------*/

/*------------------ GetMore comment on posts ------------------*/
const getMoreComments = async (req, res, next) => {
  try {
    var moreComments = await db.postComments.findAll({
      offset: req.body.offset,
      required: false,
      include: [
        {
          model: db.users,
          as: "postCommentUser",
          required: false,
          attributes: ["id", "image", "fName", "lName"],
        },
        {
          model: db.postComments,
          as: "supComments",
          limit: 1,
          required: false,
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              attributes: ["id", "image", "fName", "lName"],
            },
          ],
        },
      ],
      where: { to: req.body.id ? req.body.id : null, postId: req.body.postId },
      order: [["createdAt", "asc"]],
      limit: 3,
    });
    res.send(moreComments);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ GetMore comment on posts ------------------*/

/*------------------ add Likes on comment ------------------*/
const AddLikesOnCommentsAjax = async (req, res, next) => {
  try {
    var comment = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
    });

    if (comment.usersLikes) {
      if (comment.usersLikes.includes(parseInt(req.body.userId))) {
        if (req.body.type != "") {
          comment.LikesTypes.splice(
            comment.usersLikes.indexOf(parseInt(req.body.userId)),
            1,
            req.body.type
          );
        } else {
          comment.LikesTypes.splice(
            comment.usersLikes.indexOf(parseInt(req.body.userId)),
            1
          );
          comment.usersLikes.splice(
            comment.usersLikes.indexOf(parseInt(req.body.userId)),
            1
          );
        }
      } else {
        comment.LikesTypes.push(req.body.type);
        comment.usersLikes.push(req.body.userId);
        if (req.body.userId != req.body.frindId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.frindId,
            type: `${req.body.type}__LikeComment__${comment.comment}__${comment.id}`,
            isSeen: false,
            isRead: false,
          });
        }
      }
    } else {
      comment.LikesTypes = [req.body.type];
      comment.usersLikes = [req.body.userId];
    }
    await db.postComments.update(
      {
        usersLikes: comment.usersLikes,
        LikesTypes: comment.LikesTypes,
      },
      {
        where: {
          id: req.body.commentId,
        },
      }
    );
    res.send(comment.LikesTypes);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ add Likes on comment ------------------*/

/*------------------ get some of posts ------------------*/
const GetSomeOfPosts = async (req, res, next) => {
  try {
    var where = !req.body.place
      ? {
          [Op.or]: [
            {
              [Op.and]: [{ from: req.body.userId }, { to: req.body.userId }],
            },
            {
              [Op.and]: [
                { from: { [Op.ne]: req.body.userId } },
                { to: { [Op.eq]: req.body.userId } },
              ],
            },
          ],
        }
      : {};
    var Posts = await db.userPosts.findAndCountAll({
      where: where,
      offset: req.body.offset,
      limit: 4,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: db.users,
          as: "postsUser",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.users,
          as: "postsUserTo",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.likesPosts,
          as: "PostsLikes",
          attributes: ["usersId", "types"],
          required: false,
        },
        {
          model: db.postComments,
          as: "postComments",
          where: { to: null },
          limit: 3,
          required: false,
          order: [["createdAt", "asc"]],
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              where: { active: true },
              attributes: ["id", "fName", "lName", "image", "active"],
            },
            {
              model: db.postComments,
              as: "supComments",
              limit: 1,
              include: [
                {
                  model: db.users,
                  as: "postCommentUser",
                  where: { active: true },
                  attributes: ["id", "fName", "lName", "image", "active"],
                },
              ],
            },
          ],
        },
      ],
    });
    res.send(Posts);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get some of posts ------------------*/

/*------------------ deletePost_ajax ------------------*/
const deletePost_ajax = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
    });

    if (post.image) {
      removeImg(req, "posts_image/", post.image);
    }
    if (post.video) {
      removeImg(req, "posts_image/", post.video);
    }

    await db.userPosts.destroy({
      where: {
        id: req.body.postId,
      },
    });

    var userNumberOfPosts = await db.users.findOne({
      where: {
        id: req.cookies.User.id,
      },
      attributes: ["numberOfPosts"],
    });
    await db.users.update(
      { numberOfPosts: parseInt(userNumberOfPosts.numberOfPosts) - 1 },
      {
        where: {
          id: req.cookies.User.id,
        },
      }
    );

    var allCommentPost = await db.postComments.findAll({
      where: {
        postId: req.body.postId,
      },
    });

    allCommentPost.forEach(async (ele) => {
      await db.postComments.destroy({
        where: {
          id: ele.id,
        },
      });
    });

    var allLikesPost = await db.likesPosts.findAll({
      where: {
        postId: req.body.postId,
      },
    });
    allLikesPost.forEach(async (ele) => {
      await db.likesPosts.destroy({
        where: {
          id: ele.id,
        },
      });
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(300);
  }
};
/*------------------ deletePost_ajax ------------------*/

/*------------------ get post Data ------------------*/
const getPost_Data = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
    });
    res.send(post);
  } catch (error) {
    res.sendStatus(300);
  }
};
/*------------------ get post Data ------------------*/

/*------------------ addFrind ------------------*/
async function addRequest2(frindes, userId, userFrindId) {
  try {
    frindes.RespondDirection.splice(
      frindes.frindesId.indexOf(parseInt(userFrindId)),
      1
    );
    frindes.frindRequestTime.splice(
      frindes.frindesId.indexOf(parseInt(userFrindId)),
      1
    );
    frindes.frindesId.splice(
      frindes.frindesId.indexOf(parseInt(userFrindId)),
      1
    );
    await db.userFrindes.update(
      {
        RespondDirection: frindes.RespondDirection,
        frindRequestTime: frindes.frindRequestTime,
        frindesId: frindes.frindesId,
      },
      {
        where: {
          userId: userId,
        },
      }
    );
    if (frindes.frindesId.length == 0) {
      await db.userFrindes.destroy({
        where: {
          userId: userId,
        },
      });
    }
  } catch (error) {
    tryError(res);
  }
}

const addRequest = async (req, res, next) => {
  try {
    usersFrind = await db.userFrindes.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    frindFrinds = await db.userFrindes.findOne({
      where: {
        userId: req.body.userFrindId,
      },
    });
    if (
      usersFrind &&
      usersFrind.frindesId.includes(parseInt(req.body.userFrindId))
    ) {
      await addRequest2(usersFrind, req.body.userId, req.body.userFrindId);
      await addRequest2(frindFrinds, req.body.userFrindId, req.body.userId);
      await db.userNotification.create({
        userId: req.body.userId,
        to: req.body.userFrindId,
        type: "R.UnFollow__R.UnFollow",
        isSeen: false,
        isRead: false,
      });
    } else {
      var frindesRequest = await db.frindesRequest.findOne({
        where: {
          to: req.body.userFrindId,
        },
      });

      var frindesRequest2 = await db.frindesRequest.findOne({
        where: {
          to: req.body.userId,
        },
      });

      if (
        frindesRequest &&
        frindesRequest.from.includes(parseInt(req.body.userId))
      ) {
        frindesRequest.date.splice(
          frindesRequest.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest.notificationSeen.splice(
          frindesRequest.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest.from.splice(
          frindesRequest.from.indexOf(parseInt(req.body.userId)),
          1
        );
        if (frindesRequest.from.length == 0) {
          await db.frindesRequest.destroy({
            where: {
              to: req.body.userFrindId,
            },
          });
        }
        if (frindesRequest.to == req.body.userId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.userFrindId,
            type: "R.Cancel__R.Cancel",
            isSeen: false,
            isRead: false,
          });
        }
      } else if (
        frindesRequest2 &&
        frindesRequest2.from.includes(parseInt(req.body.userFrindId))
      ) {
        frindesRequest2.date.splice(
          frindesRequest2.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest2.notificationSeen.splice(
          frindesRequest2.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest2.from.splice(
          frindesRequest2.from.indexOf(parseInt(req.body.userId)),
          1
        );
        if (frindesRequest2.from.length == 0) {
          await db.frindesRequest.destroy({
            where: {
              to: req.body.userId,
            },
          });
        }
        if (frindesRequest2.to == req.body.userId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.userFrindId,
            type: "R.Cancel__R.Cancel",
            isSeen: false,
            isRead: false,
          });
        }
      } else if (frindesRequest) {
        frindesRequest.from.push(req.body.userId);
        frindesRequest.date.push(Date.now());
        frindesRequest.notificationSeen.push(false);
      } else {
        await db.frindesRequest.create({
          to: req.body.userFrindId,
          from: [req.body.userId],
          date: [Date.now()],
          notificationSeen: [false],
        });
        res.send("Add Request Success");
        return;
      }
      if (frindesRequest) {
        await db.frindesRequest.update(
          {
            from: frindesRequest.from,
            date: frindesRequest.date,
          },
          {
            where: {
              to: req.body.userFrindId,
            },
          }
        );
      } else {
        await db.frindesRequest.update(
          {
            from: frindesRequest2.from,
            date: frindesRequest2.date,
          },
          {
            where: {
              to: req.body.userId,
            },
          }
        );
      }
    }
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ addFrind ------------------*/

/*------------------ get All request for user ------------------*/
const getAllRequest = async function (req, res, next) {
  try {
    var allRequest = await db.frindesRequest.findOne({
      where: {
        to: req.body.userId,
      },
      attributes: ["from", "date", "notificationSeen"],
    });

    if (allRequest) {
      allRequest.notificationSeen.forEach((ele, i) => {
        allRequest.notificationSeen[i] = true;
      });
      await db.frindesRequest.update(
        {
          notificationSeen: allRequest.notificationSeen,
        },
        {
          where: {
            to: req.body.userId,
          },
        }
      );
      var userData = await db.users.findAll({
        where: {
          id: {
            [Op.in]: allRequest.from,
          },
        },
        attributes: ["fName", "lName", "image", "id"],
      });
      res.send([userData, allRequest]);
      return;
    }
    res.send([[], []]);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get All request for user ------------------*/
/*------------------ start sendMessage ------------------*/
const getUserNotification = async (req, res, next) => {
  try {
    var userNotification = await db.userNotification.findAll({
      include: [
        {
          model: db.users,
          as: "notificationUser",
          where: { active: true },
          attributes: ["image", "fName", "lName", "id"],
        },
      ],
      limit: 8,
      offset: parseInt(req.body.offset),
      where: {
        to: req.body.userId,
      },
      order: [["createdAt", "desc"]],
    });
    await db.userNotification.update(
      {
        isSeen: true,
      },
      {
        where: {
          to: req.body.userId,
        },
      }
    );

    res.send(userNotification);
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end sendMessage ------------------*/

/*------------------ cancel frendRequest ------------------*/
const CancelRequest = async (req, res, next, type = "cancel") => {
  try {
    var userFrindRequest = await db.frindesRequest.findOne({
      where: {
        to: req.body.userId,
      },
    });

    if (type == "cancel") {
      await db.userNotification.create({
        userId: req.body.userId,
        to: req.body.userFrindId,
        type: "R.Cancel__R.Cancel",
        isSeen: false,
        isRead: false,
      });
    } else {
      await db.userNotification.create({
        userId: req.body.userId,
        to: req.body.userFrindId,
        type: "R.Accept__R.Accept",
        isSeen: false,
        isRead: false,
      });
    }

    userFrindRequest.date.splice(
      userFrindRequest.from.indexOf(parseInt(req.body.userFrindId)),
      1
    );
    userFrindRequest.from.splice(
      userFrindRequest.from.indexOf(parseInt(req.body.userFrindId)),
      1
    );

    if (userFrindRequest.from.length == 0) {
      await db.frindesRequest.destroy({
        where: {
          to: req.body.userId,
        },
      });
    } else {
      await db.frindesRequest.update(
        {
          from: userFrindRequest.from,
          date: userFrindRequest.date,
        },
        {
          where: {
            to: req.body.userId,
          },
        }
      );
    }
    if (type == "cancel") {
      res.send("cancell success");
    }
  } catch (error) {
    tryError(res);
  }
};
/*------------------ cancel frendRequest ------------------*/

/*------------------ accept frendRequest ------------------*/
const acceptFrindRequest = async (req, res, next) => {
  try {
    CancelRequest(req, res, next, "accept");
    var userFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    var frindFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.body.userFrindId,
      },
    });
    acceptFrind2(frindFrindes, req.body.userFrindId, req.body.userId, true);
    acceptFrind2(userFrindes, req.body.userId, req.body.userFrindId, false);
    res.send("accept success");
  } catch (error) {
    tryError(res);
  }
};
/*------------------ accept frendRequest ------------------*/
async function acceptFrind2(frindes, userId, userFrindId, direction) {
  if (frindes) {
    frindes.frindesId.push(userFrindId);
    frindes.RespondDirection.push(direction);
    frindes.frindRequestTime.push(Date.now());
    frindes.active.push(false);
    await db.userFrindes.update(
      {
        frindesId: frindes.frindesId,
        RespondDirection: frindes.RespondDirection,
        frindRequestTime: frindes.frindRequestTime,
        active: frindes.active,
      },
      {
        where: {
          userId: userId,
        },
      }
    );
  } else {
    await db.userFrindes.create({
      userId: userId,
      frindesId: [userFrindId],
      RespondDirection: [direction],
      frindRequestTime: [Date.now()],
      active: [true],
    });
  }
}

/*------------------ changeCoverImage ------------------*/
const changeCoverImage = async (req, res, next) => {
  try {
    var images = Rename_uploade_img(req);

    var userData = await db.moreDataForUser.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (userData) {
      if (userData.coverImage)
        removeImg(req, "cover_image/", userData.coverImage);
      await db.moreDataForUser.update(
        {
          coverImage: images,
        },
        {
          where: {
            userId: req.body.userId,
          },
        }
      );
    } else {
      await db.moreDataForUser.create({
        coverImage: images,
        userId: req.body.userId,
      });
    }
    res.send("chang success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ changeCoverImage ------------------*/

/*-------------------------------------------- end part of posts ----------------------------------------*/

/*------------------ start get max descount ------------------*/
async function getMaxDescount(catigorys) {
  var MainDescoutnArr = [];
  for (var i = 0; i < catigorys.length; i++) {
    var product = await db.products.findAll({
      where: {
        catigory: catigorys[i].id,
      },
      order: [["descount", "desc"]],
      limit: 1,
    });
    if (product.length) {
      MainDescoutnArr.push(product[0].descount);
    } else {
      MainDescoutnArr.push(null);
    }
  }
  return MainDescoutnArr;
}
/*------------------ end get max descount ------------------*/

/*------------------ start get max descount ------------------*/
const getEmoji = async (req, res, next) => {
  var emoji = require("../../jsonFileForEmoji V2");
  var arrEmoji = [];
  emoji.forEach((ele) => {
    if (!arrEmoji.includes(ele) && ele.category == req.body.catigory) {
      arrEmoji.push(ele);
    }
  });
  res.send(arrEmoji);
};
/*------------------ end get max descount ------------------*/

/*------------------ end activeUserMessage ------------------*/
const UserMessage = async (req, res, next) => {
  try {
    var userFrindActive = [];
    var userFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.body.userId,
      },
      attributes: ["frindesId"],
    });

    if (userFrindes) {
      req.body.allUserFrindOnline.forEach((ele) => {
        if (userFrindes.frindesId.includes(parseInt(ele.id))) {
          userFrindActive.push(ele.id);
        }
      });
    }
    var ActiveUsers = await db.users.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: userFrindActive,
            },
          },
        ],
      },
      attributes: ["id", "image", "lName", "fName"],
    });
    var UserChate = await db.usersChat.findAll({
      where: {
        from: req.body.userId,
      },
      include: [
        {
          model: db.users,
          as: "chatUser",
          attributes: ["id", "image", "fName", "lName"],
          where: { active: true },
          include: [
            {
              model: db.usersMessage,
              as: "userFromMessage",
              where: { to: req.body.userId },
              attributes: ["message", "createdAt", "from", "isSeen"],
              order: [["createdAt", "desc"]],
              limit: 1,
            },
            {
              model: db.usersMessage,
              as: "userToMessage",
              where: { from: req.body.userId },
              attributes: ["message", "createdAt", "from", "isSeen"],
              order: [["createdAt", "desc"]],
              limit: 1,
            },
          ],
        },
      ],
      order: [["createdAt", "desc"]],
    });

    res.send([ActiveUsers, UserChate]);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end activeUserMessage ------------------*/

/*------------------ start getFrindMessages ------------------*/
const getFrindMessages = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.body.frindId,
      },
      attributes: ["lName", "fName", "id", "image"],
    });
    var messages = await db.usersMessage.findAll({
      where: {
        [Op.or]: [
          {
            from: req.body.frindId,
            to: req.body.userId,
          },
          {
            from: req.body.userId,
            to: req.body.frindId,
          },
        ],
      },
      order: [["createdAt", "asc"]],
    });

    await db.usersMessage.update(
      { isSeen: true },
      {
        where: {
          isSeen: false,
          from: req.body.frindId,
          to: req.body.userId,
        },
      }
    );
    res.send([user, messages]);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end getFrindMessages ------------------*/

/*------------------ start sendMessage ------------------*/
const sendMessage = async (req, res, next) => {
  try {
    if (req.body.isEmpty == "true") {
      await db.usersChat.bulkCreate([
        {
          from: req.body.userId,
          to: req.body.frindId,
        },
        {
          to: req.body.userId,
          from: req.body.frindId,
        },
      ]);
    }
    await db.usersMessage
      .create({
        from: req.body.userId,
        to: req.body.frindId,
        message: req.body.message,
      })
      .then(async (result) => {
        await db.usersChat.update(
          { createdAt: Date.now() },
          {
            where: {
              from: req.body.userId,
              to: req.body.frindId,
            },
          }
        );
        res.send([result.createdAt, result.message]);
      });
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end sendMessage ------------------*/

/*------------------ removeIsSeenFromChate ------------------*/
const removeIsSeenFromChate = async (req, res, next) => {
  try {
    await db.usersChat.update(
      { isSaved: false },
      {
        where: {
          from: req.body.userId,
          to: req.body.frindId,
        },
      }
    );
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ removeIsSeenFromChate ------------------*/

/*------------------ addIsSeenFromChate ------------------*/
const addIsSeenFromChate = async (req, res, next) => {
  try {
    await db.usersChat.update(
      { isSaved: true },
      {
        where: {
          from: req.body.userId,
          to: req.body.frindId,
        },
      }
    );
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ addIsSeenFromChate ------------------*/

/*-------------------- add comment ajax ----------------------------------*/
const addProductInterActionAjax = async (req, res, next) => {
  try {
    var comment = await db.doctorComments.findOne({
      where: {
        id: req.body.commentId,
      },
    });
    if (req.body.likes > comment.like) {
      if (comment.disLikeUser.includes(parseInt(req.body.userId))) {
        comment.disLikeUser.splice(
          comment.disLikeUser.indexOf(parseInt(req.body.userId)),
          1
        );
      }
      comment.likeUser.push(parseInt(req.body.userId));
    } else {
      if (comment.likeUser.includes(parseInt(parseInt(req.body.userId)))) {
        comment.likeUser.splice(
          comment.likeUser.indexOf(parseInt(req.body.userId)),
          1
        );
      }
      if (req.body.desLikes > comment.disLike) {
        comment.disLikeUser.push(parseInt(req.body.userId));
      } else {
        comment.disLikeUser.splice(
          comment.disLikeUser.indexOf(parseInt(req.body.userId)),
          1
        );
      }
    }
    await db.doctorComments.update(
      {
        like: req.body.likes,
        disLike: req.body.desLikes,
        likeUser: comment.likeUser,
        disLikeUser: comment.disLikeUser,
      },
      {
        where: {
          id: req.body.commentId,
        },
      }
    );
    res.send("تم التعديل بنجاح");
  } catch (error) {
    tryError(res, error);
  }
};
/*-------------------- add comment ajax ----------------------------------*/
const allDoctorComments = async (req, res, error) => {
  try {
    var doctorComments = await db.doctorComments.findAndCountAll({
      limit: req.query.limit,
      offset: parseInt(req.query.page - 1) * req.query.limit,
      order: [["like", "desc"]],
      include: {
        model: db.users,
        as: "commentUser",
        attributes: ["fName", "lName", "image", "id"],
      },
      where: {
        doctorId: req.params.id,
      },
    });

    var doctor = await db.doctors.findOne({
      where: {
        id: req.params.id,
      },
    });
    var query = req.query;
    res.render("frontEnd/userPages/allDoctorComments", {
      title: "allDoctorComments",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      query,
      doctor,
      formateDate: formateDate,
      doctorComments,
      pages: paginate.getArrayPages(req)(
        req.query.limit,
        Math.ceil(doctorComments.count / req.query.limit),
        req.query.page
      ),
      page: req.query.page,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const allPharmacy = async (req, res, error) => {
  try {
    var allPharmacy = await db.medicin.findAll({
      where: {
        province: {
          [Op.like]: `${req.query.province ? req.query.province : ""}%`,
        },
        village: {
          [Op.like]: `${req.query.village ? req.query.village : ""}%`,
        },
      },
    });
    res.render("frontEnd/userPages/allPharmacy", {
      title: "All Pharmacy",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      formateDate: formateDate,
      pages: paginate.getArrayPages(req)(
        req.query.limit,
        Math.ceil(allPharmacy.length / req.query.limit),
        req.query.page
      ),
      page: req.query.page,
      Qyery: req.query,
      allPharmacy,
      doctor: req.cookies.Doctors,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const showPharmacy = async (req, res, error) => {
  try {
    var Pharmacy = await db.medicin.findOne({});
    res.render("frontEnd/userPages/PharmacyData", {
      title: "Pharmacy Data",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      formateDate: formateDate,
      Qyery: req.query,
      Pharmacy,
      doctor: req.cookies.Doctors,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const showLab = async (req, res, error) => {
  try {
    var Lab = await db.labs.findOne({});
    res.render("frontEnd/userPages/LabsData", {
      title: "lab Data",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      formateDate: formateDate,
      Qyery: req.query,
      Lab,
      doctor: req.cookies.Doctors,
    });
  } catch (error) {
    tryError(res, error);
  }
};
const allLabs = async (req, res, error) => {
  try {
    var allLabs = await db.labs.findAll({
      where: {
        province: {
          [Op.like]: `${req.query.province ? req.query.province : ""}%`,
        },
        village: {
          [Op.like]: `${req.query.village ? req.query.village : ""}%`,
        },
      },
    });
    res.render("frontEnd/userPages/allLabs", {
      title: "All Pharmacy",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      formateDate: formateDate,
      pages: paginate.getArrayPages(req)(
        req.query.limit,
        Math.ceil(allLabs.length / req.query.limit),
        req.query.page
      ),
      page: req.query.page,
      Qyery: req.query,
      allLabs,
      doctor: req.cookies.Doctors,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const mackOrderController = async (req, res, next) => {
  try {
    res.render("frontEnd/userPages/mackOrder", {
      title: "Mack Order",
      validationError: req.flash("validationError")[0],
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      doctor: req.cookies.Doctors,
    });
  } catch (error) {
    tryError(res);
  }
};

const mackOrderControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/mackOrder/" + req.params.id);
      removeImg(req, "pharmacyOrderImage/");
      return;
    }
    var image = Rename_uploade_img(req);
    req.body.image = image;
    await db.pharmacyOrders.create(req.body);

    returnWithMessage(
      req,
      res,
      "/mackOrder/" + req.params.id,
      "Order successful remepmer you should call pharmacy number for confirming order",
      "success"
    );
  } catch (error) {
    tryError(res);
  }
};
module.exports = {
  allPharmacy,
  mackOrderControllerPost,
  mackOrderController,
  getDataSearch_ajax,
  getMyAccount,
  editPersonalInformationGet,
  editPersonalInformationPost,
  editPostAjax,
  getSearchUserData,
  showLab,
  allLabs,
  addPostAjax,
  AddLikesAjax,
  addCommentOnPosts,
  getMoreComments,
  AddLikesOnCommentsAjax,
  GetSomeOfPosts,
  getEmoji,
  membersPosts,
  deletePost_ajax,
  getPost_Data,
  deleteCommentAjax,
  editCommentAjax,
  getCommentData,
  addRequest,
  getAllRequest,
  CancelRequest,
  acceptFrindRequest,
  changeCoverImage,
  bookingDoctor_post,
  UserMessage,
  sendMessage,
  getFrindMessages,
  allDoctorComments,
  getUserNotification,
  removeIsSeenFromChate,
  addIsSeenFromChate,
  homePage,
  All_Doctors,
  doctorProfile,
  getSearchDoctorData,
  addDoctorComment,
  bookingDoctor,
  addProductInterActionAjax,
  showPharmacy,
};
