const { dashpord_page_controller } = require("../../controllers/backEnd/dashpord_controller");

const router = require("express").Router();




router.get("/dashpord" , dashpord_page_controller)


module.exports = {
    dashpord : router
}