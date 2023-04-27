import nodemailer from 'nodemailer';

export async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "10e1d04504bc28",
        pass: "e4932419740cdb"
      }
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info.response;
  } catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
}