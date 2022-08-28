import nodemailer from "nodemailer";

export default function (emailReceived, content){
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ecommrce.galaxy.corp@gmail.com',
        pass: '0918599314'
       }
    });
    const mailOptions = {
        from: '"Online System" <ecommerce.galaxy.corp@gmail.com>', // sender address
        to: emailReceived, // list of receivers
        subject: 'Online System ✔', // Subject line
        text: 'Mailing System', // plaintext body
        html: content
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}