import nodemailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // replace with your email address
    pass: process.env.PASSWORD, // replace with your password
  },
});

// setup email data with unicode symbols
let mailOptions = {
  from: '"John Doe" <johndoe@gmail.com>', // sender address
  to: "ovedhee@gmail.com", // list of receivers
  subject: "Test Email", // Subject line
  text: "Hello World!", // plain text body
  html: "<b>Hello World!</b>", // html body
};

// send mail with defined transport object
async function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

sendMail(mailOptions);
