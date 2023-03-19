import nodemailer from "nodemailer";
import logger from "./logger";

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

// const payload = {
//   from: MAIL_SETTINGS.auth.user,
//   to: params.to,
//   subject: "Hello ✔",
//   html: `
//       <div
//         class="container"
//         style="max-width: 90%; margin: auto; padding-top: 20px"
//       >
//         <h2>Welcome to the club.</h2>
//         <h4>You are officially In ✔</h4>
//         <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
//         <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
//    </div>
//     `,
// };
