const {
  homePage,
  All_Doctors,
  doctorProfile,
  addDoctorComment,

  getDataSearch_ajax,
  getSearchUserData,
  getMyAccount,
  editPersonalInformationGet,
  editPersonalInformationPost,
  membersPosts,
  addPostAjax,
  AddLikesAjax,
  editPostAjax,
  addCommentOnPosts,
  deleteCommentAjax,
  editCommentAjax,
  getCommentData,
  getMoreComments,
  AddLikesOnCommentsAjax,
  GetSomeOfPosts,
  getEmoji,
  deletePost_ajax,
  getPost_Data,
  addRequest,
  CancelRequest,
  acceptFrindRequest,
  getAllRequest,
  getUserNotification,
  changeCoverImage,
  getFrindMessages,
  UserMessage,
  sendMessage,
  removeIsSeenFromChate,
  addIsSeenFromChate,
  bookingDoctor,
  bookingDoctor_post,
  getSearchDoctorData,
  addProductInterActionAjax,
  allDoctorComments,
  allPharmacy,
  allLabs,
  mackOrderController,
  mackOrderControllerPost,
  showPharmacy,
  showLab,
} = require("../../controllers/frontEnd/pageControllerUser");
const { uploade_img_multi_fild, uploade_img } = require("../../Helper/helper");
const {
  userAuthonticat,
} = require("../../middel_ware/frontEnd/userAuthonticate");
const {
  editPersonalData_validation,
} = require("../../validation/frontEnd/editPersonalData_validation");
const {
  pharmacyOrderValidate,
} = require("../../validation/frontEnd/pharmacyOrder.validate");

const Router = require("express").Router();

Router.get("/home", homePage);
Router.get("/All_Doctors", All_Doctors);
Router.post("/getSearchDoctorData", getSearchDoctorData);
Router.get("/doctorProfile/:id", doctorProfile);
Router.get("/bookingDoctor/:id", userAuthonticat, bookingDoctor);
Router.post("/bookingDoctor/:id", userAuthonticat, bookingDoctor_post);
Router.post("/addDoctorComment", userAuthonticat, addDoctorComment);
Router.get("/allDoctorComments/:id", allDoctorComments);
Router.get("/allPharmacy", allPharmacy);
Router.get("/PharmacyData/:id", showPharmacy);
Router.get("/showLab/:id", showLab);
Router.get("/allLabs", allLabs);
Router.get("/mackOrder/:id", mackOrderController);
Router.post(
  "/mackOrder/:id",
  userAuthonticat,
  uploade_img("public/backEnd/assets/img/pharmacyOrderImage", "image"),
  pharmacyOrderValidate(),
  mackOrderControllerPost
);
Router.post(
  "/addProductInterActionAjax",
  userAuthonticat,
  addProductInterActionAjax
);

Router.post("/getSearchData", getDataSearch_ajax);
Router.post("/getSearchUserData", getSearchUserData);
Router.get("/userProfile/:id", userAuthonticat, getMyAccount);
Router.get("/news", userAuthonticat, getMyAccount);
Router.get(
  "/editPersonalInformation",
  userAuthonticat,
  editPersonalInformationGet
);
Router.post(
  "/editPersonalInformation",
  userAuthonticat,
  uploade_img("public/admin/asset/images/users_photo", "image"),
  editPersonalData_validation(),
  editPersonalInformationPost
);
Router.get("/membersPosts", userAuthonticat, membersPosts);

/*-------------------------------------------- start part of posts ----------------------------------------*/
Router.post(
  "/addPostAjax",
  userAuthonticat,
  uploade_img_multi_fild(
    [
      {
        name: "image",
      },
      {
        name: "video",
      },
    ],
    "public/backEnd/assets/img/posts_image"
  ),
  addPostAjax
);
/*-------------------------------------------- edit post ajax ----------------------------------------*/
Router.post(
  "/editPostAjax",
  userAuthonticat,
  uploade_img_multi_fild(
    [
      {
        name: "image",
      },
      {
        name: "video",
      },
    ],
    "public/backEnd/assets/img/posts_image"
  ),
  editPostAjax
);
Router.post("/AddLikes", userAuthonticat, AddLikesAjax);
Router.post(
  "/addCommentOnPosts",
  userAuthonticat,
  uploade_img("public/backEnd/assets/img/comment_photo", "image"),
  addCommentOnPosts
);
Router.post("/deleteCommentAjax", userAuthonticat, deleteCommentAjax);
Router.post(
  "/editCommentAjax",
  userAuthonticat,
  uploade_img("public/backEnd/assets/img/comment_photo", "image"),
  editCommentAjax
);
Router.post("/getCommentData", userAuthonticat, getCommentData);
Router.post("/getMoreComments", userAuthonticat, getMoreComments);
Router.post("/AddLikesOnCommentsAjax", userAuthonticat, AddLikesOnCommentsAjax);
Router.post("/GetSomeOfPosts", userAuthonticat, GetSomeOfPosts);
Router.post("/getEmoji", userAuthonticat, getEmoji);
Router.post("/deletePost_ajax", userAuthonticat, deletePost_ajax);
Router.post("/getPost_Data", userAuthonticat, getPost_Data);
Router.post("/addRequest", userAuthonticat, addRequest);
Router.post("/CancelRequest", userAuthonticat, CancelRequest);
Router.post("/acceptFrindRequest", userAuthonticat, acceptFrindRequest);
Router.post("/getAllRequest", userAuthonticat, getAllRequest);
Router.post("/getUserNotification", userAuthonticat, getUserNotification);
Router.post(
  "/changeCoverImage",
  userAuthonticat,
  uploade_img("public/backEnd/assets/img/cover_image", "imageCover"),
  changeCoverImage
);
Router.post("/getFrindMessages", userAuthonticat, getFrindMessages);
Router.post("/UserMessage", userAuthonticat, UserMessage);
Router.post("/sendMessage", userAuthonticat, sendMessage);
Router.post("/removeIsSeenFromChate", userAuthonticat, removeIsSeenFromChate);
Router.post("/addIsSeenFromChate", userAuthonticat, addIsSeenFromChate);
module.exports = {
  userPages: Router,
};
