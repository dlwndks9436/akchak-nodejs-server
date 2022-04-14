import nodemailer from "nodemailer";

export const sendMail = async (recipient: string, authCode: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(
    {
      from: "dlwndks9436@naver.com",
      to: recipient,
      subject: "Welcome to Resonar!",
      text: "The validation code is : " + authCode,
    },
    (err, info) => {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  );
};
