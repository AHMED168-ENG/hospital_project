const { tryError } = require("../../Helper/helper")



const userAuthonticat = async (req , res , next) => {
    try {
        if(!req.cookies.User) {
            res.redirect("/pationt/signIn")      
        } else {
            next()
        }
    } catch (error) {
        tryError(res)
    }
}










module.exports = {
    userAuthonticat
}