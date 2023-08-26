import nodemailer from "nodemailer"
import config from "../config/config.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailPassword
    }
})

transporter.verify(function (error, success){
    if (error) {
        console.log(error);
    }else{
        console.log("Server is ready to take our message");
    }
})


export const sendMail = (req,res) => {
    try {
        let result = transporter.sendMail({
            from: "",
            to: "ismaelroalzugaray@gmail.com",
            subject: "Restablecer contraseña KretzCommerce",
            html: `<div><h1>Haga click <a href="http://localhost:9090/api/views/passwordchange">AQUI</a> para restablecer su contraseña</h1></div>`
        }, (error, info) => {
            if (error){
                console.log(error);
                res.status(400).send({message: "Se produjo un error", payload: error})
            }else{
                res.send({message: "Success", payload: info})
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({message: "No se pudo enviar el email", error: error })
    }
}

export const delMail = (user) => {
    try {
        let result = transporter.sendMail({
            from: "",
            to: user,
            subject: "Su producto ha sido eliminado",
            html: `<div><h1>Un producto creado por usted ha sido eliminado por uno de los Administradores de KretzCommerce</h1></div>`
        }, (error, info) => {
            if (error){
            console.log(error);
        }})

    } catch (error) {
        console.log(error);
    }
}

