const { check } = require("express-validator")



/*-------------------- start add specialist -------------------------*/
const AddSpecialist_validation = () => {
    return [
        check("name").notEmpty().withMessage("You must enter the name of the department"),
        check("description").notEmpty().withMessage("You must enter a section description name"),
        check("image").custom(async (value , {req}) => {
            if(req.files.length == 0 && req.url != "/EditSpecialities") {
                throw new Error("")
            }  
            return true
        }).withMessage("You must enter the image section").custom((value , {req}) => {
            req.files.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
            return true
        }).withMessage(`Images must have jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            req.files.forEach(element => {
                if(element.size > 2000000) {
                    throw new Error("")
                }
            });
            return true
        }).withMessage("الصوره يجب الا تزيد عن 2000000 kb")
    ]
}
/*-------------------- end add specialist -------------------------*/


module.exports = {
    AddSpecialist_validation
}