import nodemailer from "nodemailer"
import "dotenv/config"

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true, 
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD
    }
}

const transpot = nodemailer.createTransport(nodemailerConfig)

const data = {
    to: "foxijax108@wanbeiz.com",
    subject: "Test email",
    html: "<a>Test email</a>"
}

const sendEmail = (data) => {
    const email = {...data, from: UKR_NET_EMAIL}
    return transpot.sendMail(email)
}

export default sendEmail