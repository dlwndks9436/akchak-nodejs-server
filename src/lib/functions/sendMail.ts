import nodemailer from "nodemailer";

export const sendMail = async (
  recipient: string,
  name: string,
  verificationCode: string
) => {
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
      subject: "악착 인증코드",
      text: `
${name}님, 안녕하세요.
귀하의 이메일 주소를 통해 악착 계정 ${recipient}에 대한 인증 코드가 요청되었습니다.
악착 인증 코드는 다음과 같습니다.
${verificationCode}
이 코드를 요청하지 않았다면 다른 사람이 악착 계정 ${recipient}에 액세스하려고 시도하는 것일 수 있습니다.
누구에게도 이 코드를 전달하거나 제공하면 안 됩니다.
본 메일은 이 이메일 주소가 악착 계정의 이메일로 등록되었기 때문에 발송되었습니다.
문의사항이 있으시면 dlwndks9436@naver.com 으로 문의바랍니다.
감사합니다`,
    },
    (err, info) => {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  );
};
