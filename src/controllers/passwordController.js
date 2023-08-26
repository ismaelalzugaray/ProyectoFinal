import userModel from "../services/mongoDB/models/usersModel.js"
import {passValidation, createHash} from "../../utils.js"

export const restorePassword = async (req, res) => {

    try {

        const newPassword = req.body.password
        const email = req.body.email
        const user = await userModel.findOne({email})
        console.log(user);

        if (passValidation(user, newPassword)){
            return res.status(400).send({Status: "Error", message: "La nueva contraseña no puede ser similar a la anterior"})
        }
            console.log("changin password");
            let modifiedPassword = createHash(newPassword)
            user.password = modifiedPassword
            let result = await userModel.updateOne({_id: user._id}, user)
            res.status(200).send({Status: "Success", message: "La contraseña a sido restablecida"})


    } catch (error) {
        
    }
}