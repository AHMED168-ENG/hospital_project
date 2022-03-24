const { validationResult } = require("express-validator")
const { tryError, removeImg, handel_validation_errors, Rename_uploade_img, returnWithMessage } = require("../../Helper/helper")
const db = require("../../models")


/*--------------------------- show_specialist_controller ----------------------*/
const show_specialist_controller = async(req , res ,next) => {
    try {
        var AllSpecialities = await db.specialist.findAll({
            order : [["createdAt" , "desc"]]
        })
        res.render("backEnd/show_specialities" , {
            title : "specialities",
            notification : req.flash("notification")[0],
            URL : req.url,
            AllSpecialities
        })
    } catch (error) {
        tryError(res)
    }
}
/*--------------------------- show_specialist_controller ----------------------*/

/*--------------------------- Add_specialist_controller ----------------------*/
const Add_specialist_post_controller = async(req , res , next) => {
    try {
        var validationError = validationResult(req).errors
        if(validationError.length > 0) {
            removeImg(req)
            var errors = handel_validation_errors(req , res , validationError , "only")
            res.send({type:"error" , data : errors})
            return
        }
        var image = Rename_uploade_img(req)
        await db.specialist.create({
            name : req.body.name,
            description : req.body.description,
            active : req.body.active ? true : false,
            image : image,
        })
        res.send({"type" : "success" , data : "تم تسجيل القسم بنجاح"})

    } catch (error) {
        tryError(res)
    }
}
/*--------------------------- Add_specialist_controller ----------------------*/

/*--------------------------- getSpecifieData ----------------------*/
const getSpecifieData = async(req , res , next) => {
    try {
        var SpecifieData = await db.specialist.findOne({
            where : {
                id : req.body.id
            }
        })
        res.send(SpecifieData)
    } catch (error) {
        tryError(res)
    }
}
/*--------------------------- getSpecifieData ----------------------*/

/*--------------------------- edit_specialist_controller ----------------------*/
const edit_specialist_controller = async(req , res , next) => {
    try {
        var validationError = validationResult(req).errors
        if(validationError.length > 0) {
            removeImg(req)
            var errors = handel_validation_errors(req , res , validationError , "only")
            res.send({type:"error" , data : errors})
            return
        }

        var image = Rename_uploade_img(req)
        if(image) removeImg(req , "specialities/" , req.body.oldImage)

        await db.specialist.update({
            name : req.body.name,
            description : req.body.description,
            active : req.body.active ? true : false,
            image : image ? image : req.body.oldImage,
        } , {
            where : {
                id : req.body.specialistId
            }
        })
        res.send({"type" : "success" , data : "تم تحديث القسم بنجاح"})
    } catch (error) {
        tryError(res , error)
    }
} 
/*--------------------------- edit_specialist_controller ----------------------*/

/*--------------------------- activeSpecialist_controller ----------------------*/
const activeSpecialist_controller = async(req , res , next) => {
    try {
        await db.specialist.update({
            active : req.body.type == "1" ? true : false,
        } , {
            where : {
                id : req.body.specialistId
            }
        })
        res.send("success")
    } catch (error) {
        tryError(res)
    }
}
/*--------------------------- activeSpecialist_controller ----------------------*/

/*--------------------------- deleteSpecialist_controller ----------------------*/
const deleteSpecialist_controller = async(req , res , next) => {
    try {
        await db.specialist.destroy({
            where : {
                id : req.body.id
            }
        })
        removeImg(req , "specialities/" , req.body.deletedImage)
        returnWithMessage(req , res , "/specialities/AllSpecialities" , "Section has been deleted successfully" , "success")
    } catch (error) {
        tryError(res)
    }
}
/*--------------------------- deleteSpecialist_controller ----------------------*/

/*--------------------------- redirect with message whene add specificatio_controller ----------------------*/
const redirect_withMessage = async(req , res , next)=> {
    try {
        var type = req.query.type
        var message = req.query.message
        returnWithMessage(req , res , "AllSpecialities" , message , type)
    } catch (error) {
        tryError(res , error)
    }
}
/*--------------------------- redirect with message whene add specificatio_controller ----------------------*/



module.exports = {
    show_specialist_controller,
    Add_specialist_post_controller,
    redirect_withMessage,
    getSpecifieData,
    edit_specialist_controller,
    activeSpecialist_controller,
    deleteSpecialist_controller
}