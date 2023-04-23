import nodemailer from "nodemailer";
import logger from "./logger.js";

// async function createTestCredentials() {
//   const credentials = await nodemailer.createTestAccount();
//   console.log(credentials);
// }

// createTestCredentials();

// smtp: {
//   user: "z7d5zyhxp5zcv3mr@ethereal.email",
//   pass: "5SpvtaChAWEWWajbsa",
//   host: "smtp.ethereal.email",
//   port: "587",
//   secure: false, // set secure to true on production
// }

const MAIL_SETTINGS = {
  service: "gmail",
  auth: {
    user: "z7d5zyhxp5zcv3mr@ethereal.email",
    pass: "5SpvtaChAWEWWajbsa",
  },
};

const transporter = nodemailer.createTransport({
  MAIL_SETTINGS,
});

async function sendEmail(payload) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      logger.error(err, "Error sending email");
      return;
    }
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
