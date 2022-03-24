const { show_specialist_controller , deleteSpecialist_controller , Add_specialist_post_controller , activeSpecialist_controller , redirect_withMessage, getSpecifieData, edit_specialist_controller } = require("../../controllers/backEnd/specialities_controller")
const { uploade_img } = require("../../helper/helper")
const { AddSpecialist_validation } = require("../../validation/backEnd/specialist_validation")

const Router = require("express").Router()


Router.get("/AllSpecialities" , show_specialist_controller)
Router.post("/AddSpecialities" , uploade_img("public/backEnd/assets/img/specialities" , "image") , AddSpecialist_validation() ,  Add_specialist_post_controller )
Router.get("/redirect_withMessage" , redirect_withMessage)
Router.post("/EditSpecialities" , uploade_img("public/backEnd/assets/img/specialities" , "image") , AddSpecialist_validation() ,  edit_specialist_controller )
Router.post("/activeSpecialist" , activeSpecialist_controller )
Router.post("/deleteSpecialist" , deleteSpecialist_controller )
Router.post("/getSpecifieData" , getSpecifieData)


module.exports = {
    specialist : Router
}