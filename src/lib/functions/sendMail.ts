import nodemailer from "nodemailer";

export const sendMail = async (recipient: string, verificationCode: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_USERNAME as string),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(
    {
      from: process.env.EMAIL_SENDER,
      to: recipient,
      subject: "Welcome to Akchack!",
      text: "The verification code is : " + verificationCode,
    },
    (err, info) => {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  );
};
