const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const db = require("../models");

async function sendEmail(email, id, fName, lName, subject, url) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "104c2a023d38b8",
      pass: "da0a230968ced1",
    },
  });
  var mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    html: `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title></title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="css/style.css" rel="stylesheet">
        </head>
        <body>
            <h3>welcome mr  ${fName} ${lName}  in my application </h3>
            <p>we import on your privacy</p>
            <p>${subject}</p>
            ${
              id
                ? `<a href='http://localhost:3000/${url}/${id}'>active account</a>`
                : ""
            }
            
            
        </body>
    </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  sendEmail,
};
