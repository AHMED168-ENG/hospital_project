const {
  homePage,
  All_Doctors,
  doctorProfile,
  addDoctorComment,
  MainPageController,
  catigoryShow_controller,
  productDetails_controller,
  getProductAllComments,
  getDataSearch_ajax,
  getSearchUserData,
  getAllProduct,
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
} = require("../../controllers/frontEnd/pageControllerUser");
const { uploade_img_multi_fild, uploade_img } = require("../../Helper/helper");
const {
  userAuthonticat,
} = require("../../middel_ware/frontEnd/userAuthonticate");
const {
  editPersonalData_validation,
} = require("../../validation/frontEnd/editPersonalData_validation");

const Router = require("express").Router();

Router.get("/home", homePage);
Router.get("/All_Doctors", All_Doctors);
Router.get("/doctorProfile/:id", doctorProfile);
Router.post("/addDoctorComment", addDoctorComment);

Router.get("/home", MainPageController);
Router.get("/catigoryDetails/:id", catigoryShow_controller);
Router.get("/productDetails/:id", productDetails_controller);
Router.get("/ProductAllComments/:id", getProductAllComments);
Router.post("/getSearchData", getDataSearch_ajax);
Router.post("/getSearchUserData", getSearchUserData);
Router.get("/AllProduct", getAllProduct);
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
  editPersonalData_validation,
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
    "public/admin/asset/images/posts"
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
    "public/admin/asset/images/posts"
  ),
  editPostAjax
);
Router.post("/AddLikes", userAuthonticat, AddLikesAjax);
Router.post(
  "/addCommentOnPosts",
  userAuthonticat,
  uploade_img("public/admin/asset/images/commentsPhoto", "image"),
  addCommentOnPosts
);
Router.post("/deleteCommentAjax", userAuthonticat, deleteCommentAjax);
Router.post(
  "/editCommentAjax",
  userAuthonticat,
  uploade_img("public/admin/asset/images/commentsPhoto", "image"),
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
  uploade_img(
    "public/admin/asset/images/users_photo/cover_image",
    "imageCover"
  ),
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
