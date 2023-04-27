import nodemailer from "nodemailer";

export async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}
